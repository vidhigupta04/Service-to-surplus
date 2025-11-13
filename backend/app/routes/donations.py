from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Donation, Request, User
from datetime import datetime

# Create the blueprint - THIS MUST BE PRESENT
bp = Blueprint('donations', __name__, url_prefix='/api/donations')

@bp.route('/', methods=['POST'])
@jwt_required()
def create_donation():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    donation = Donation(
        title=data['title'],
        description=data.get('description', ''),
        quantity=data['quantity'],
        food_type=data.get('food_type', 'vegetarian'),
        expiry_time=datetime.fromisoformat(data['expiry_time']),
        location=data['location'],
        donor_id=user_id
    )
    
    db.session.add(donation)
    db.session.commit()
    
    return jsonify({'message': 'Donation created successfully', 'id': donation.id}), 201

@bp.route('/', methods=['GET'])
@jwt_required()
def get_donations():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role == 'donor':
        donations = Donation.query.filter_by(donor_id=user_id).all()
    else:
        donations = Donation.query.filter(Donation.status == 'available').all()
    
    donations_data = []
    for donation in donations:
        donations_data.append({
            'id': donation.id,
            'title': donation.title,
            'description': donation.description,
            'quantity': donation.quantity,
            'food_type': donation.food_type,
            'expiry_time': donation.expiry_time.isoformat(),
            'location': donation.location,
            'status': donation.status,
            'donor_name': donation.donor.organization_name or donation.donor.username,
            'created_at': donation.created_at.isoformat()
        })
    
    return jsonify(donations_data)

@bp.route('/<int:donation_id>/request', methods=['POST'])
@jwt_required()
def create_request(donation_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'ngo':
        return jsonify({'message': 'Only NGOs can request donations'}), 403
    
    donation = Donation.query.get(donation_id)
    if not donation or donation.status != 'available':
        return jsonify({'message': 'Donation not available'}), 404
    
    data = request.get_json()
    request_obj = Request(
        donation_id=donation_id,
        ngo_id=user_id,
        message=data.get('message', '')
    )
    
    donation.status = 'claimed'
    db.session.add(request_obj)
    db.session.commit()
    
    return jsonify({'message': 'Request submitted successfully'}), 201

@bp.route('/requests', methods=['GET'])
@jwt_required()
def get_requests():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role == 'donor':
        requests = Request.query.join(Donation).filter(Donation.donor_id == user_id).all()
    else:
        requests = Request.query.filter_by(ngo_id=user_id).all()
    
    requests_data = []
    for req in requests:
        requests_data.append({
            'id': req.id,
            'donation_title': req.donation.title,
            'donation_quantity': req.donation.quantity,
            'ngo_name': req.ngo.organization_name or req.ngo.username,
            'message': req.message,
            'status': req.status,
            'created_at': req.created_at.isoformat()
        })
    
    return jsonify(requests_data)