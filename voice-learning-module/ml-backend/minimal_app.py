#!/usr/bin/env python
"""Minimal Flask app to test"""

from flask import Flask, jsonify
from flask_cors import CORS

print("Creating Flask app...")
app = Flask(__name__)
CORS(app)

print("Registering routes...")

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'timestamp': 'test'}), 200

@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'Hello from Flask'}), 200

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

print("Routes registered successfully")

if __name__ == '__main__':
    print("Starting Flask app...")
    app.run(host='0.0.0.0', port=5000, debug=False)
    print("App stopped")
