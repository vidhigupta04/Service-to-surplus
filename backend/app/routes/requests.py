from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Request, Donation, User
from datetime import datetime

# Create the blueprint - THIS WAS MISSING
bp = Blueprint('requests', __name__, url_prefix='/api/requests')

@bp.route('/', methods=['GET'])
@jwt_required()
def get_requests():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role == 'donor':
            # Donors see requests for their donations
            requests = Request.query.join(Donation).filter(
                Donation.donor_id == user_id
            ).order_by(Request.created_at.desc()).all()
        else:
            # NGOs see their own requests
            requests = Request.query.filter_by(ngo_id=user_id).order_by(Request.created_at.desc()).all()
        
        return jsonify([req.to_dict() for req in requests]), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch requests: {str(e)}', 'success': False}), 500

@bp.route('/<int:request_id>', methods=['GET'])
@jwt_required()
def get_request(request_id):
    try:
        request_obj = Request.query.get_or_404(request_id)
        return jsonify(request_obj.to_dict()), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch request: {str(e)}', 'success': False}), 500

@bp.route('/<int:request_id>/status', methods=['PUT'])
@jwt_required()
def update_request_status(request_id):
    try:
        user_id = get_jwt_identity()
        request_obj = Request.query.get_or_404(request_id)
        donation = Donation.query.get(request_obj.donation_id)
        
        # Check if user is the donor of the donation
        if donation.donor_id != user_id:
            return jsonify({'message': 'Unauthorized', 'success': False}), 403
        
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['approved', 'rejected', 'collected']:
            return jsonify({'message': 'Invalid status', 'success': False}), 400
        
        request_obj.status = new_status
        request_obj.updated_at = datetime.utcnow()
        
        # Update donation status if collected
        if new_status == 'collected':
            donation.status = 'collected'
            request_obj.collection_time = datetime.utcnow()
        elif new_status == 'approved':
            donation.status = 'claimed'
        elif new_status == 'rejected':
            donation.status = 'available'
            # Reject all other pending requests for this donation
            Request.query.filter_by(
                donation_id=request_obj.donation_id, 
                status='pending'
            ).update({'status': 'rejected'})
        
        db.session.commit()
        
        return jsonify({'message': f'Request {new_status} successfully', 'success': True}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update request: {str(e)}', 'success': False}), 500

@bp.route('/<int:request_id>', methods=['DELETE'])
@jwt_required()
def delete_request(request_id):
    try:
        user_id = get_jwt_identity()
        request_obj = Request.query.get_or_404(request_id)
        
        # Check if user is the NGO that made the request
        if request_obj.ngo_id != user_id:
            return jsonify({'message': 'Unauthorized', 'success': False}), 403
        
        # Only allow deletion of pending requests
        if request_obj.status != 'pending':
            return jsonify({'message': 'Can only delete pending requests', 'success': False}), 400
        
        # Reset donation status if this was the only request
        donation = Donation.query.get(request_obj.donation_id)
        other_requests = Request.query.filter_by(
            donation_id=request_obj.donation_id,
            status='pending'
        ).filter(Request.id != request_id).count()
        
        if other_requests == 0:
            donation.status = 'available'
        
        db.session.delete(request_obj)
        db.session.commit()
        
        return jsonify({'message': 'Request deleted successfully', 'success': True}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete request: {str(e)}', 'success': False}), 500