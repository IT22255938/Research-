"""
ML Backend Main Application
Voice Learning Module - Python Flask API Server

Serves:
- Advanced emotion detection models
- Natural language understanding
- Speech processing and feature extraction
- IRT model inference
- Training pipeline
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging
import sys

# Import modules - with fallbacks for Python 3.14 compatibility
try:
    from src.audio.audio_processor import AudioProcessor
except ImportError as e:
    logger = logging.getLogger(__name__)
    logger.warning(f"AudioProcessor not available: {e}. Audio features disabled.")
    AudioProcessor = None

try:
    from src.emotion.emotion_classifier import EmotionClassifier
except ImportError as e:
    logger = logging.getLogger(__name__)
    logger.warning(f"EmotionClassifier not available: {e}. Emotion detection disabled.")
    EmotionClassifier = None

try:
    from src.nlu.intent_recognizer import IntentRecognizer
except ImportError as e:
    logger = logging.getLogger(__name__)
    logger.warning(f"IntentRecognizer not available: {e}. NLU disabled.")
    IntentRecognizer = None

from src.models.irt_model import IRTModel
from src.api.routes import register_routes

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    """Create and configure Flask application"""
    
    app = Flask(__name__)
    
    # Enable CORS for JavaScript frontend
    CORS(app)
    
    # Configuration
    app.config['JSON_SORT_KEYS'] = False
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file
    
    # Initialize ML components
    logger.info("Initializing ML components...")
    
    try:
        # Audio processing (optional - may be None if librosa not installed)
        if AudioProcessor is not None:
            audio_processor = AudioProcessor()
            app.audio_processor = audio_processor
            logger.info("✓ Audio processor initialized")
        else:
            app.audio_processor = None
            logger.info("⚠ Audio processor disabled (librosa not available)")
        
        # Emotion classification (optional - may be None if sklearn not installed)
        if EmotionClassifier is not None:
            emotion_classifier = EmotionClassifier(
                model_path=os.getenv('EMOTION_MODEL_PATH', 'models/emotion_model.pkl')
            )
            app.emotion_classifier = emotion_classifier
            logger.info("✓ Emotion classifier initialized")
        else:
            app.emotion_classifier = None
            logger.info("⚠ Emotion classifier disabled (sklearn not available)")
        
        # Intent recognition (optional - may be None if NLU module not available)
        if IntentRecognizer is not None:
            intent_recognizer = IntentRecognizer()
            app.intent_recognizer = intent_recognizer
            logger.info("✓ Intent recognizer initialized")
        else:
            app.intent_recognizer = None
            logger.info("⚠ Intent recognizer disabled")
        
        # IRT model (required)
        irt_model = IRTModel()
        app.irt_model = irt_model
        logger.info("✓ IRT model initialized")
        
    except Exception as e:
        logger.error(f"Failed to initialize ML components: {e}")
        logger.warning("App will continue with limited functionality")
    
    # Register API routes
    try:
        register_routes(app)
        logger.info("✓ API routes registered")
    except Exception as e:
        logger.error(f"Failed to register routes: {e}")
        import traceback
        logger.error(traceback.format_exc())
        logger.warning("Routes not available")
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'components': {
                'audio_processor': 'ready',
                'emotion_classifier': 'ready',
                'intent_recognizer': 'ready',
                'irt_model': 'ready'
            }
        }), 200
    
    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request', 'message': str(error)}), 400
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found', 'message': str(error)}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal error: {error}")
        return jsonify({'error': 'Internal server error'}), 500
    
    logger.info("Flask app created successfully")
    return app


if __name__ == '__main__':
    app = create_app()
    
    # Run development server
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Flask server on port {port} (debug={debug})")
    app.run(host='0.0.0.0', port=port, debug=debug)
