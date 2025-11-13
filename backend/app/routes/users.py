from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User

# Create the blueprint - THIS WAS MISSING
bp = Blueprint('users', __name__, url_prefix='/api/users')

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found', 'success': False}), 404
            
        data = request.get_json()
        
        if 'organization_name' in data:
            user.organization_name = data['organization_name']
        if 'contact_number' in data:
            user.contact_number = data['contact_number']
        if 'address' in data:
            user.address = data['address']
        
        user.updated_at = db.func.now()
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'organization_name': user.organization_name,
                'contact_number': user.contact_number,
                'address': user.address,
                'is_approved': user.is_approved
            },
            'success': True
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update profile: {str(e)}', 'success': False}), 500

@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role == 'donor':
            from app.models import Donation
            stats = {
                'total_donations': Donation.query.filter_by(donor_id=user_id).count(),
                'active_donations': Donation.query.filter_by(donor_id=user_id, status='available').count(),
                'claimed_donations': Donation.query.filter_by(donor_id=user_id, status='claimed').count(),
                'completed_donations': Donation.query.filter_by(donor_id=user_id, status='collected').count()
            }
        else:
            from app.models import Request
            stats = {
                'total_requests': Request.query.filter_by(ngo_id=user_id).count(),
                'pending_requests': Request.query.filter_by(ngo_id=user_id, status='pending').count(),
                'approved_requests': Request.query.filter_by(ngo_id=user_id, status='approved').count(),
                'completed_requests': Request.query.filter_by(ngo_id=user_id, status='collected').count()
            }
        
        return jsonify({'stats': stats, 'success': True}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch stats: {str(e)}', 'success': False}), 500