from flask import Flask, jsonify
import sqlite3
import bcrypt
import jwt as pyjwt
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'message': 'Test server is running!',
        'packages': {
            'flask': '✅ Working',
            'sqlite3': '✅ Working', 
            'bcrypt': '✅ Working',
            'jwt': '✅ Working'
        }
    })

@app.route('/test-bcrypt')
def test_bcrypt():
    # Test bcrypt
    password = "test123"
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    check = bcrypt.checkpw(password.encode('utf-8'), hashed)
    
    return jsonify({
        'bcrypt_working': check,
        'test_password': 'test123',
        'hashed_password': hashed.decode('utf-8')
    })

if __name__ == '__main__':
    print("Starting test server...")
    print("Visit http://localhost:5000 to test")
    app.run(debug=True, port=5000)