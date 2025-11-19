from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Donation, Request, User
from datetime import datetime

bp = Blueprint('donations', __name__, url_prefix='/api/donations')


# ---------------- CREATE DONATION ----------------
@bp.route('', methods=['POST'])
@jwt_required()
def create_donation():
    user_id = get_jwt_identity()

    # Support JSON + Multipart (image optional)
    if request.content_type.startswith("multipart/form-data"):
        data = request.form
        image = request.files.get("image")
        image_url = None

        if image:
            image_path = f"uploads/{image.filename}"
            image.save(image_path)
            image_url = image_path

    else:
        data = request.get_json()
        image_url = data.get("image_url")

    # SAFE expiry_time handling
    expiry_raw = data.get("expiry_time")
    try:
        expiry_time = datetime.fromisoformat(expiry_raw.replace("Z", ""))
    except:
        return jsonify({"error": "Invalid expiry_time format"}), 422

    donation = Donation(
        title=data.get("title"),
        description=data.get("description", ""),
        quantity=str(data.get("quantity")),            # FIXED (ensure string)
        food_type=data.get("food_type", "vegetarian"),
        expiry_time=expiry_time,
        location=data.get("location"),
        image_url=image_url,                           # OPTIONAL
        donor_id=user_id
    )

    db.session.add(donation)
    db.session.commit()

    return jsonify({
        "message": "Donation created successfully",
        "id": donation.id
    }), 201


# ---------------- GET DONATIONS ----------------
@bp.route('', methods=['GET'])
@jwt_required()
def get_donations():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role == 'donor':
        donations = Donation.query.filter_by(donor_id=user_id).all()
    else:
        donations = Donation.query.filter(Donation.status == 'available').all()

    donation_list = []
    for d in donations:
        donation_list.append({
            "id": d.id,
            "title": d.title,
            "description": d.description,
            "quantity": d.quantity,
            "food_type": d.food_type,
            "expiry_time": d.expiry_time.isoformat(),
            "location": d.location,
            "status": d.status,
            "image_url": d.image_url,
            "donor_name": d.donor.organization_name or d.donor.username,
            "created_at": d.created_at.isoformat()
        })

    return jsonify(donation_list)


# ---------------- NGO REQUEST DONATION ----------------
@bp.route('/<int:donation_id>/request', methods=['POST'])
@jwt_required()
def create_request(donation_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != "ngo":
        return jsonify({"message": "Only NGOs can request donations"}), 403

    donation = Donation.query.get(donation_id)
    if not donation or donation.status != "available":
        return jsonify({"message": "Donation not available"}), 404

    data = request.get_json()

    req = Request(
        donation_id=donation_id,
        ngo_id=user_id,
        message=data.get("message", "")
    )

    donation.status = "claimed"

    db.session.add(req)
    db.session.commit()

    return jsonify({"message": "Request submitted successfully"}), 201


# ---------------- GET ALL REQUESTS ----------------
@bp.route('/requests', methods=['GET'])
@jwt_required()
def get_requests():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role == "donor":
        requests = Request.query.join(Donation).filter(Donation.donor_id == user_id).all()
    else:
        requests = Request.query.filter_by(ngo_id=user_id).all()

    out = []
    for r in requests:
        out.append({
            "id": r.id,
            "donation_title": r.donation.title,
            "donation_quantity": r.donation.quantity,
            "ngo_name": r.ngo.organization_name or r.ngo.username,
            "message": r.message,
            "status": r.status,
            "created_at": r.created_at.isoformat()
        })

    return jsonify(out)
