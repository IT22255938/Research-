#!/usr/bin/env python
"""Simple Flask server test"""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'Hello from Flask'}), 200

if __name__ == '__main__':
    print("Starting simple Flask server...")
    import sys
    try:
        print("About to call app.run()...", file=sys.stdout, flush=True)
        app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False, threaded=True)
        print("app.run() returned normally", file=sys.stdout, flush=True)
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error: {e}", file=sys.stdout, flush=True)
        import traceback
        traceback.print_exc()
    finally:
        print("Flask app exiting...", file=sys.stdout, flush=True)
