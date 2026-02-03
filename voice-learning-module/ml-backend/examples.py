"""
ML Backend Quick Start Guide
Voice Learning Module - Python ML Server
"""

from src.audio.audio_processor import AudioProcessor
from src.emotion.emotion_classifier import EmotionClassifier
from src.nlu.intent_recognizer import IntentRecognizer
from src.models.irt_model import IRTModel, ItemParameters
import numpy as np

# Example usage of ML components


def example_emotion_detection():
    """Example: Emotion detection from audio"""
    print("\n=== EMOTION DETECTION EXAMPLE ===")
    
    # Initialize
    audio_processor = AudioProcessor(sample_rate=16000)
    emotion_classifier = EmotionClassifier()
    
    # Load audio (replace with actual audio file)
    # audio, sr = audio_processor.load_audio('sample_audio.wav')
    # features = audio_processor.extract_features(audio, sr)
    # emotion = emotion_classifier.classify(features)
    
    print("Emotion classifier ready")
    print("Features extracted:")
    print("  - MFCC coefficients")
    print("  - Spectral features")
    print("  - Pitch estimation")
    print("  - Energy characteristics")
    print("  - Speech rate")


def example_intent_recognition():
    """Example: Intent recognition from text"""
    print("\n=== INTENT RECOGNITION EXAMPLE ===")
    
    intent_recognizer = IntentRecognizer()
    
    # Test cases
    test_inputs = [
        "five",
        "the answer is five",
        "help me",
        "yes, that's correct",
        "what did you say?",
    ]
    
    for text in test_inputs:
        result = intent_recognizer.recognize_intent(text)
        print(f"\nInput: '{text}'")
        print(f"Intent: {result['intent']}")
        print(f"Confidence: {result['confidence']:.2f}")
        if result['entities']:
            print(f"Entities: {result['entities']}")


def example_answer_validation():
    """Example: Validate student answer"""
    print("\n=== ANSWER VALIDATION EXAMPLE ===")
    
    intent_recognizer = IntentRecognizer()
    
    # Test cases
    test_cases = [
        ('five', '5', 'numeric', 'Numeric answer'),
        ('the apple', 'apple', 'text', 'Text answer'),
        ('seven', '5', 'numeric', 'Wrong numeric answer'),
    ]
    
    for user_answer, correct_answer, answer_type, description in test_cases:
        is_correct = intent_recognizer.validate_answer(
            user_answer, correct_answer, answer_type
        )
        similarity = intent_recognizer.calculate_similarity(
            user_answer, correct_answer
        )
        
        print(f"\n{description}")
        print(f"User: '{user_answer}' | Correct: '{correct_answer}'")
        print(f"Valid: {is_correct} | Similarity: {similarity:.2f}")


def example_irt_model():
    """Example: IRT adaptive difficulty"""
    print("\n=== IRT ADAPTIVE DIFFICULTY EXAMPLE ===")
    
    irt_model = IRTModel(initial_ability=0.0)
    
    # Create item bank
    items = [
        ItemParameters(difficulty=-1.0, discrimination=1.0, guessing=0.2, 
                      item_id='easy_1', name='Easy Question 1'),
        ItemParameters(difficulty=0.0, discrimination=1.2, guessing=0.2, 
                      item_id='medium_1', name='Medium Question 1'),
        ItemParameters(difficulty=1.0, discrimination=1.0, guessing=0.2, 
                      item_id='hard_1', name='Hard Question 1'),
    ]
    
    # Simulate student responses
    student_id = 'student_001'
    responses = [True, True, False, True]  # Correct/incorrect patterns
    
    print(f"\nSimulating {len(responses)} responses:")
    
    for i, is_correct in enumerate(responses):
        # Select next item
        next_item = irt_model.select_next_item(student_id, items, strategy='mfi')
        
        # Evaluate response
        student = irt_model.evaluate_response(
            student_id, 
            next_item.item_id,
            is_correct,
            next_item,
            response_time=5.0 + np.random.normal(0, 2)
        )
        
        print(f"\nResponse {i+1}: {next_item.name}")
        print(f"  Correct: {is_correct}")
        print(f"  Ability: {student.ability:.2f}")
        print(f"  SE: {student.standard_error:.2f}")
        print(f"  Accuracy: {student.correct_count}/{student.item_count}")
    
    # Get final statistics
    stats = irt_model.get_statistics(student_id)
    print(f"\n--- Final Statistics ---")
    print(f"Ability: {stats['ability']:.2f}")
    print(f"Confidence: {stats['confidence']:.2f}")
    print(f"Accuracy: {stats['accuracy']:.1%}")
    print(f"Trend: {stats['performance_trend']}")


def example_api_server():
    """Example: Start API server"""
    print("\n=== STARTING API SERVER ===")
    
    print("""
To start the Flask API server:

    python app.py

The server will be available at:
    http://localhost:5000

API Endpoints:
    GET  /health                          - Health check
    
    POST /api/emotion/analyze             - Emotion detection from audio
    
    POST /api/nlu/intent                  - Intent recognition from text
    POST /api/nlu/validate-answer         - Validate student answer
    
    POST /api/audio/features              - Extract audio features
    
    POST /api/irt/evaluate                - Evaluate response and update ability
    POST /api/irt/next-item               - Get next item to administer
    GET  /api/irt/statistics/<student_id> - Get student statistics
    
    POST /api/analyze/complete            - Complete analysis pipeline

Example using curl:

    # Health check
    curl http://localhost:5000/health
    
    # Intent recognition
    curl -X POST http://localhost:5000/api/nlu/intent \\
         -H "Content-Type: application/json" \\
         -d '{"text": "the answer is five"}'
    """)


if __name__ == '__main__':
    example_emotion_detection()
    example_intent_recognition()
    example_answer_validation()
    example_irt_model()
    example_api_server()
    
    print("\n✓ Examples completed!")
