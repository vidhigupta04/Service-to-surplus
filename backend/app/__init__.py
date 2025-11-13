from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

# ✅ FIX: Configure CORS properly
cors = CORS()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///service_to_surplus.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'jwt-secret-key-change-in-production'
    
    # ✅ FIX: Configure CORS to allow frontend
    app.config['CORS_HEADERS'] = 'Content-Type'
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # ✅ FIX: Enable CORS for all routes with proper configuration
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Create database tables
    with app.app_context():
        try:
            from app.models import User, Donation, Request
            db.create_all()
            print("✅ Database tables created successfully")
        except Exception as e:
            print(f"❌ Database error: {e}")

    # Register blueprints
    try:
        from app.routes.auth import bp as auth_bp
        app.register_blueprint(auth_bp)
        print("✅ Auth routes registered")
    except Exception as e:
        print(f"❌ Auth routes error: {e}")

    try:
        from app.routes.donations import bp as donations_bp
        app.register_blueprint(donations_bp)
        print("✅ Donation routes registered")
    except Exception as e:
        print(f"❌ Donation routes error: {e}")

    try:
        from app.routes.users import bp as users_bp
        app.register_blueprint(users_bp)
        print("✅ User routes registered")
    except Exception as e:
        print(f"❌ User routes error: {e}")

    # Routes
    @app.route('/')
    def home():
        return jsonify({
            'message': 'Service to Surplus API is running! 🚀',
            'status': 'success',
            'version': '1.0.0',
            'cors': 'enabled for frontend'
        })

    @app.route('/status')
    def status_check():
        return jsonify({
            'status': 'healthy ✅',
            'service': 'Service to Surplus API',
            'database': 'connected',
            'cors': 'configured'
        })

    print("✅ All routes registered successfully")
    return app