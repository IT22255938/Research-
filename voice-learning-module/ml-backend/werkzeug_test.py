#!/usr/bin/env python
"""Flask with Werkzeug server directly"""

from flask import Flask, jsonify
from flask_cors import CORS
from werkzeug.serving import run_simple
import sys

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'Flask is running'}), 200

if __name__ == '__main__':
    print("Starting Flask with Werkzeug run_simple...", flush=True)
    sys.stdout.flush()
    
    try:
        run_simple(
            hostname='0.0.0.0',
            port=5000,
            application=app,
            use_reloader=False,
            use_debugger=False,
            use_evalex=False
        )
    except KeyboardInterrupt:
        print("\nServer interrupted by user", flush=True)
    except Exception as e:
        print(f"Error: {e}", flush=True)
        import traceback
        traceback.print_exc()
