from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Donation, Request
from datetime import datetime, timedelta

# Create the blueprint - THIS WAS MISSING
bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'admin'

@bp.route('/users/pending', methods=['GET'])
@jwt_required()
def get_pending_users():
    try:
        if not is_admin(get_jwt_identity()):
            return jsonify({'message': 'Admin access required', 'success': False}), 403
        
        pending_users = User.query.filter_by(is_approved=False).all()
        return jsonify([user.to_dict() for user in pending_users]), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch pending users: {str(e)}', 'success': False}), 500

@bp.route('/users/<int:user_id>/approve', methods=['POST'])
@jwt_required()
def approve_user(user_id):
    try:
        if not is_admin(get_jwt_identity()):
            return jsonify({'message': 'Admin access required', 'success': False}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found', 'success': False}), 404
        
        user.is_approved = True
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'User approved successfully', 'success': True}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to approve user: {str(e)}', 'success': False}), 500

@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    try:
        if not is_admin(get_jwt_identity()):
            return jsonify({'message': 'Admin access required', 'success': False}), 403
        
        stats = {
            'total_users': User.query.count(),
            'total_donors': User.query.filter_by(role='donor', is_approved=True).count(),
            'total_ngos': User.query.filter_by(role='ngo', is_approved=True).count(),
            'pending_approvals': User.query.filter_by(is_approved=False).count(),
            'total_donations': Donation.query.count(),
            'active_donations': Donation.query.filter_by(status='available').count(),
            'total_requests': Request.query.count(),
            'completed_donations': Donation.query.filter_by(status='collected').count()
        }
        
        return jsonify({'stats': stats, 'success': True}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch admin stats: {str(e)}', 'success': False}), 500

@bp.route('/reports/donations', methods=['GET'])
@jwt_required()
def get_donation_reports():
    try:
        if not is_admin(get_jwt_identity()):
            return jsonify({'message': 'Admin access required', 'success': False}), 403
        
        # Get donations from last 30 days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_donations = Donation.query.filter(
            Donation.created_at >= thirty_days_ago
        ).all()
        
        report = {
            'period': 'last_30_days',
            'total_donations': len(recent_donations),
            'by_status': {},
            'by_food_type': {},
            'timeline': []
        }
        
        for donation in recent_donations:
            # Count by status
            report['by_status'][donation.status] = report['by_status'].get(donation.status, 0) + 1
            # Count by food type
            report['by_food_type'][donation.food_type] = report['by_food_type'].get(donation.food_type, 0) + 1
        
        return jsonify({'report': report, 'success': True}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to generate report: {str(e)}', 'success': False}), 500