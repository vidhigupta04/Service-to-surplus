from app import create_app
from flask_cors import CORS

app = create_app()

# Apply CORS AFTER app is created
CORS(app, supports_credentials=True)

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 SERVICE TO SURPLUS - BACKEND SERVER")
    print("=" * 60)
    print("📍 Main URL: http://localhost:5000/")
    print("📍 Status:   http://localhost:5000/status")
    print("📍 Test:     http://localhost:5000/test")
    print("📍 Register: POST http://localhost:5000/api/auth/register")
    print("📍 Login:    POST http://localhost:5000/api/auth/login")
    print("=" * 60)
    print("⏹️  Press CTRL+C to stop the server")
    print("=" * 60)

    app.run(debug=True, host='0.0.0.0', port=5000)
