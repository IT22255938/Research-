#!/usr/bin/env python
"""Minimal Flask test - no threading"""

from flask import Flask, jsonify
from flask_cors import CORS
import sys
import time

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'Flask is running'}), 200

if __name__ == '__main__':
    print("Starting Flask...", flush=True)
    sys.stdout.flush()
    sys.stderr.flush()
    
    # Try running with development server
    print("Calling app.run...", flush=True)
    sys.stdout.flush()
    
    app.run(
        host='0.0.0.0', 
        port=5000, 
        debug=False, 
        use_reloader=False,
        use_debugger=False,
        threaded=False
    )
    
    print("app.run returned", flush=True)
