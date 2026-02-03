# ML Backend Documentation

## Python Machine Learning Backend

Complete ML infrastructure for the Voice Learning Module with advanced capabilities:

### Features

- **Audio Processing**: Acoustic feature extraction using librosa
- **Emotion Detection**: Deep learning-based emotion classification
- **Natural Language Understanding**: Intent recognition and entity extraction
- **Item Response Theory**: Research-grade adaptive difficulty implementation
- **REST API**: Complete API for frontend integration

### Project Structure

```
ml-backend/
├── app.py                 # Flask application entry point
├── requirements.txt       # Python dependencies
├── setup.py              # Package configuration
├── examples.py           # Usage examples
├── .env.example          # Environment variables template
├── src/
│   ├── audio/            # Audio processing module
│   │   └── audio_processor.py
│   ├── emotion/          # Emotion detection module
│   │   └── emotion_classifier.py
│   ├── nlu/              # NLU module
│   │   └── intent_recognizer.py
│   ├── models/           # ML models
│   │   └── irt_model.py
│   └── api/              # REST API
│       └── routes.py
├── models/               # Pre-trained models storage
├── data/                 # Training data
└── tests/                # Unit tests
```

### Installation

1. **Install Python Dependencies**

```bash
pip install -r requirements.txt
```

2. **Configure Environment**

```bash
cp .env.example .env
```

3. **Start the Server**

```bash
python app.py
```

Server will run on `http://localhost:5000`

### API Endpoints

#### Emotion Detection

```
POST /api/emotion/analyze
Content-Type: multipart/form-data or application/json

Request:
  - audio: File or audio_base64: Base64-encoded audio

Response:
{
  "status": "success",
  "emotion": {
    "confidence": 0.8,
    "frustration": 0.3,
    "engagement": 0.7,
    "dominant_emotion": "engaged",
    "all_emotions": {...}
  }
}
```

#### Intent Recognition

```
POST /api/nlu/intent
Content-Type: application/json

Request:
{
  "text": "User input text",
  "context": {
    "question_type": "numeric",
    "activity": "counting-adventure"
  }
}

Response:
{
  "status": "success",
  "intent": "answer_numeric",
  "confidence": 0.9,
  "entities": {"number": ["5"]},
  "validation": {"is_valid": true}
}
```

#### Answer Validation

```
POST /api/nlu/validate-answer

Request:
{
  "user_answer": "five",
  "correct_answer": "5",
  "answer_type": "numeric"
}

Response:
{
  "status": "success",
  "is_correct": true,
  "similarity": 0.95,
  "feedback": "Correct! Well done!"
}
```

#### IRT Model Evaluation

```
POST /api/irt/evaluate

Request:
{
  "student_id": "student_123",
  "item_id": "item_456",
  "is_correct": true,
  "item_params": {
    "difficulty": 0.5,
    "discrimination": 1.2,
    "guessing": 0.2
  },
  "response_time": 5.2
}

Response:
{
  "status": "success",
  "ability": 0.45,
  "standard_error": 0.8,
  "accuracy": 0.8,
  "performance_trend": "improving"
}
```

#### Get Next Item

```
POST /api/irt/next-item

Request:
{
  "student_id": "student_123",
  "item_bank": [{...}],
  "strategy": "mfi"
}

Response:
{
  "status": "success",
  "item": {...},
  "recommended_difficulty": 0.45
}
```

#### Get Statistics

```
GET /api/irt/statistics/<student_id>

Response:
{
  "status": "success",
  "statistics": {
    "ability": 0.45,
    "standard_error": 0.8,
    "items_attempted": 10,
    "accuracy": 0.8,
    "performance_trend": "improving"
  }
}
```

#### Complete Analysis Pipeline

```
POST /api/analyze/complete

Request:
{
  "student_id": "student_123",
  "audio_base64": "...",
  "user_text": "five",
  "item_id": "item_456",
  "correct_answer": "5",
  "answer_type": "numeric",
  "item_params": {...}
}

Response:
{
  "status": "success",
  "results": {
    "emotion": {...},
    "intent": {...},
    "validation": {...},
    "ability": {...}
  }
}
```

### Module Details

#### AudioProcessor

Features extracted:
- MFCC (Mel-Frequency Cepstral Coefficients)
- Mel spectrogram
- Spectral centroid and rolloff
- Zero crossing rate (ZCR)
- RMS energy
- Fundamental frequency (pitch)
- Chroma features
- Delta (velocity) features

#### EmotionClassifier

Emotion dimensions:
- **Confidence**: 0-1 scale (low hesitation, fluent = high)
- **Frustration**: 0-1 scale (high pitch, fast speech = high)
- **Engagement**: 0-1 scale (clear articulation, good prosody = high)

Dominant emotions:
- calm (low frustration, high confidence)
- engaged (high engagement)
- frustrated (high frustration)
- confused (low confidence, low engagement)

#### IntentRecognizer

Recognized intents:
- `answer_numeric`: Numeric response
- `answer_text`: Text response
- `ask_for_help`: Request for assistance
- `request_hint`: Request for hint
- `confirm`: Affirmative response
- `deny`: Negative response
- `request_repeat`: Request to repeat
- `express_emotion`: Emotional expression

#### IRTModel

Three-Parameter Logistic (3PL) model:
$$P(\theta) = c + (1-c) \times \frac{1}{1 + e^{-a(\theta - b)}}$$

Where:
- $\theta$ = student ability
- $a$ = item discrimination
- $b$ = item difficulty
- $c$ = guessing parameter

Features:
- Bayesian ability updates
- Fisher information-based item selection
- Adaptive learning rate
- Response time integration

### Integration with Frontend

Connect the JavaScript frontend to the Python ML backend:

```javascript
// Example from JavaScript frontend
async function analyzeResponse(audioData, userText, isCorrect) {
  const response = await fetch('http://localhost:5000/api/analyze/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      student_id: studentId,
      audio_base64: btoa(audioData),
      user_text: userText,
      item_id: currentItem.id,
      correct_answer: currentItem.answer,
      answer_type: 'numeric',
      item_params: {
        difficulty: currentItem.difficulty,
        discrimination: currentItem.discrimination,
        guessing: currentItem.guessing
      }
    })
  });
  
  return response.json();
}
```

### Examples

Run the examples file:

```bash
python examples.py
```

This demonstrates:
- Emotion detection workflow
- Intent recognition with various inputs
- Answer validation
- IRT adaptive difficulty algorithm
- API server startup

### Performance Considerations

- **Audio Processing**: ~100-500ms for feature extraction (depending on audio length)
- **Emotion Classification**: ~50-100ms
- **Intent Recognition**: ~10-20ms
- **IRT Updates**: <1ms
- **API Response Time**: 100-300ms typical

### Future Enhancements

1. **Deep Learning Models**
   - CNN/LSTM for emotion detection
   - Transformer-based NLU
   - Whisper/Vosk for offline ASR

2. **Advanced Analytics**
   - Learning curve analysis
   - Skill taxonomy implementation
   - Multi-dimensional IRT (MIRT)

3. **Research Features**
   - Model calibration utilities
   - Parameter estimation from data
   - Statistical validation tools

4. **Deployment**
   - Docker containerization
   - AWS/GCP deployment
   - Model serving infrastructure

### Troubleshooting

**Audio processing errors:**
- Ensure librosa is properly installed: `pip install --upgrade librosa`
- Check audio format is WAV, MP3, or OGG

**Model loading errors:**
- Verify model files exist in `models/` directory
- Check file permissions

**API connection issues:**
- Verify CORS is configured for your frontend origin
- Check firewall settings for port 5000

### References

- Item Response Theory: Baker, F. B. (2001)
- Audio Features: Ellis, D. P. (2005)
- MFCC: Davis & Mermelstein (1980)

### License

Part of Voice Learning Module project
