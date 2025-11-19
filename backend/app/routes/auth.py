from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User
import bcrypt

# THIS LINE MUST BE PRESENT IN EVERY ROUTE FILE
bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already taken'}), 400

    user = User(
        username=data['username'],
        email=data['email'],
        role=data['role'],
        organization_name=data.get('organization_name', ''),
        contact_number=data.get('contact_number', ''),
        address=data.get('address', '')
    )
    user.set_password(data['password'])
    
    # Auto-approve donors, require approval for NGOs
    user.is_approved = data['role'] == 'donor'
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):
        # if not user.is_approved:
        #     return jsonify({'message': 'Account pending approval'}), 403
            
        access_token = create_access_token(
             identity=str(user.id),          
             additional_claims={"sub": str(user.id)}  
        )
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'organization_name': user.organization_name
            }
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'organization_name': user.organization_name,
        'contact_number': user.contact_number,
        'address': user.address,
        # 'is_approved': user.is_approved
    })