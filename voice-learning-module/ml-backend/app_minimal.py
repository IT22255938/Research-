"""
ML Backend - Minimal Flask Server
Python 3.14 compatible starter app
"""

from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging
import sys

load_dotenv()

# Suppress Flask warnings
logging.getLogger('werkzeug').setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app)

# Import and register database routes
try:
    from src.api.database_routes import db_api
    app.register_blueprint(db_api)
    print("[INFO] Database API routes loaded")
except Exception as e:
    print(f"[WARNING] Could not load database routes: {e}")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "operational",
        "message": "Voice Learning Module ML Backend is running",
        "python_version": "3.14",
        "features": {
            "audio_processing": False,
            "emotion_detection": False,
            "nlu": False,
            "irt_model": True
        }
    }), 200

@app.route('/api/irt/statistics/<student_id>', methods=['GET'])
def get_student_stats(student_id):
    """Get student statistics (placeholder)"""
    return jsonify({
        "student_id": student_id,
        "ability": 0.0,
        "standard_error": 0.5,
        "accuracy": 0.5,
        "message": "IRT Model placeholder - upgrade requirements.txt for full ML features"
    }), 200


if __name__ == '__main__':
    # Clean environment - remove conflicting variables
    for key in list(os.environ.keys()):
        if 'WERKZEUG' in key or 'FLASK' in key:
            del os.environ[key]
    
    port = int(os.getenv('PORT', 5000))
    
    print("\n" + "="*50)
    print("Voice Learning Module - Flask Backend")
    print("="*50)
    print(f"✓ Starting server on http://127.0.0.1:{port}")
    print(f"✓ API Health: http://127.0.0.1:{port}/health")
    print("✓ Python 3.14 compatible (minimal mode)")
    print("="*50 + "\n")
    
    try:
        # Run without reloader and debug
        from werkzeug.serving import make_server
        server = make_server('127.0.0.1', port, app, threaded=True)
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Server stopped")
        import sys
        sys.exit(0)
    except Exception as e:
        print(f"✗ Error: {e}")
        import sys
        sys.exit(1)
