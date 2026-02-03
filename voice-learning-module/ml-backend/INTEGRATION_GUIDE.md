# Frontend-Backend Integration Guide

## Connecting JavaScript Frontend to Python ML Backend

This guide shows how to integrate the JavaScript Voice Learning Module frontend with the Python ML backend.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   Browser (Client)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  JavaScript Frontend                                     │  │
│  │  - voice-learning-module.js (Orchestrator)              │  │
│  │  - speech-recognizer.js (STT)                           │  │
│  │  - text-to-speech.js (TTS)                              │  │
│  │  - emotion-detector.js (Basic emotion)                  │  │
│  │  - adaptive-difficulty-engine.js (Local IRT)            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│                   HTTP/REST Calls                              │
│                          ↓                                       │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                 Python ML Backend Server                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Flask API Server (port 5000)                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Audio Processing (audio_processor.py)              │  │  │
│  │  │ - MFCC extraction                                  │  │  │
│  │  │ - Spectral analysis                                │  │  │
│  │  │ - Pitch estimation                                 │  │  │
│  │  │ - Energy computation                               │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Emotion Classifier (emotion_classifier.py)         │  │  │
│  │  │ - Deep learning models                             │  │  │
│  │  │ - Feature normalization                            │  │  │
│  │  │ - Rule-based heuristics                            │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ NLU Module (intent_recognizer.py)                  │  │  │
│  │  │ - Intent recognition                               │  │  │
│  │  │ - Entity extraction                                │  │  │
│  │  │ - Answer validation                                │  │  │
│  │  │ - Similarity calculation                           │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ IRT Model (irt_model.py)                           │  │  │
│  │  │ - Ability estimation                               │  │  │
│  │  │ - Adaptive item selection                          │  │  │
│  │  │ - Bayesian updates                                 │  │  │
│  │  │ - Fisher information                               │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Database (SQLite/PostgreSQL)                                  │
│  - Student profiles                                            │
│  - Response history                                            │
│  - Item calibration                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Start the Python ML Backend

```bash
# Navigate to ml-backend directory
cd ml-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Start the server
python app.py
```

The server will be available at `http://localhost:5000`

### 2. Configure Frontend for Backend Communication

Update `src/core/voice-learning-module.js`:

```javascript
// Add ML backend configuration
class VoiceLearningModule {
  constructor(config = {}) {
    this.mlBackendUrl = config.mlBackendUrl || 'http://localhost:5000';
    // ... rest of initialization
  }
  
  // ... existing code ...
}
```

### 3. Integration Points

#### A. Emotion Analysis

**Before (Local JavaScript):**
```javascript
// In voice-learning-module.js
const emotionAnalysis = this.emotionDetector.analyzeFromFeatures(features);
```

**After (Using Python Backend):**
```javascript
async analyzeEmotionWithBackend(audioData) {
  try {
    const response = await fetch(
      `${this.mlBackendUrl}/api/emotion/analyze`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_base64: btoa(audioData)
        })
      }
    );
    
    const result = await response.json();
    return result.emotion;
  } catch (error) {
    console.error('Emotion analysis error:', error);
    // Fallback to local JavaScript implementation
    return this.emotionDetector.analyzeFromFeatures(features);
  }
}
```

#### B. Intent Recognition and Answer Validation

**Before (Local JavaScript):**
```javascript
// Check answer locally
const isCorrect = this.validateAnswer(userResponse, correctAnswer);
```

**After (Using Python Backend):**
```javascript
async validateAnswerWithBackend(userResponse, correctAnswer, answerType = 'text') {
  try {
    const response = await fetch(
      `${this.mlBackendUrl}/api/nlu/validate-answer`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_answer: userResponse,
          correct_answer: correctAnswer,
          answer_type: answerType
        })
      }
    );
    
    const result = await response.json();
    return {
      isCorrect: result.is_correct,
      similarity: result.similarity,
      feedback: result.feedback
    };
  } catch (error) {
    console.error('Validation error:', error);
    // Fallback to local validation
    return this.validateAnswerLocally(userResponse, correctAnswer);
  }
}
```

#### C. Adaptive Difficulty

**Before (Local JavaScript IRT):**
```javascript
// Local IRT implementation
const nextDifficulty = this.adaptiveEngine.selectDifficulty(studentAbility);
```

**After (Using Python Backend):**
```javascript
async getNextItemDifficulty(studentId, itemBank, strategy = 'mfi') {
  try {
    const response = await fetch(
      `${this.mlBackendUrl}/api/irt/next-item`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          item_bank: itemBank,
          strategy: strategy
        })
      }
    );
    
    const result = await response.json();
    return {
      nextItem: result.item,
      recommendedDifficulty: result.recommended_difficulty
    };
  } catch (error) {
    console.error('Next item error:', error);
    // Fallback to local IRT
    return this.adaptiveEngine.selectNextQuestion(studentAbility);
  }
}
```

#### D. Complete Analysis Pipeline

**Single Call for All Analysis:**
```javascript
async performCompleteAnalysis(analysisData) {
  try {
    const response = await fetch(
      `${this.mlBackendUrl}/api/analyze/complete`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: analysisData.studentId,
          audio_base64: btoa(analysisData.audioData),
          user_text: analysisData.userText,
          item_id: analysisData.itemId,
          correct_answer: analysisData.correctAnswer,
          answer_type: analysisData.answerType,
          item_params: {
            difficulty: analysisData.itemDifficulty,
            discrimination: analysisData.itemDiscrimination,
            guessing: analysisData.itemGuessing
          },
          response_time: analysisData.responseTime
        })
      }
    );
    
    const result = await response.json();
    return result.results; // Contains emotion, intent, validation, ability
  } catch (error) {
    console.error('Complete analysis error:', error);
    // Fallback or local processing
  }
}
```

### 4. Update Main Activity Loop

In `src/core/voice-learning-module.js`, update `handleResponse()`:

```javascript
async handleResponse(userResponse, audioBuffer) {
  const startTime = Date.now();
  
  try {
    // Perform complete analysis
    const analysis = await this.performCompleteAnalysis({
      studentId: this.currentStudent.id,
      audioData: audioBuffer,
      userText: userResponse,
      itemId: this.currentQuestion.id,
      correctAnswer: this.currentQuestion.answer,
      answerType: this.currentQuestion.answerType,
      itemDifficulty: this.currentQuestion.difficulty,
      itemDiscrimination: this.currentQuestion.discrimination,
      itemGuessing: this.currentQuestion.guessing,
      responseTime: (Date.now() - startTime) / 1000
    });
    
    // Extract results
    const emotion = analysis.emotion;
    const validation = analysis.validation;
    const ability = analysis.ability;
    
    // Update session state
    this.currentStudent.emotion = emotion;
    this.currentStudent.lastAbility = ability.ability;
    
    // Generate feedback based on validation
    const isCorrect = validation.is_correct;
    const feedback = await this.generateFeedback(
      isCorrect,
      emotion,
      this.currentQuestion
    );
    
    // Provide feedback
    await this.voiceSynthesizer.speak(feedback, {
      emotion: isCorrect ? 'encouraging' : 'calm'
    });
    
    // Get next question
    if (this.sessionState === 'active') {
      const nextQuestion = await this.selectNextQuestion(
        this.currentStudent.id,
        this.currentStudent.lastAbility
      );
      
      await this.presentQuestion(nextQuestion);
    }
    
  } catch (error) {
    this.logger.error('Error handling response:', error);
    await this.voiceSynthesizer.speak(
      'I had trouble understanding that. Please try again.'
    );
  }
}
```

### 5. Error Handling and Fallbacks

Implement graceful degradation:

```javascript
class VoiceLearningModule {
  // ... existing code ...
  
  async analyzeWithFallback(audioData, analysisType) {
    try {
      // Try ML backend first
      const backendUrl = `${this.mlBackendUrl}/api/${analysisType}`;
      return await this.callBackendAPI(backendUrl, audioData);
    } catch (error) {
      this.logger.warn(`Backend ${analysisType} failed, using fallback`);
      // Fall back to local implementation
      return this.getLocalAnalysis(audioData, analysisType);
    }
  }
  
  async callBackendAPI(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      timeout: 5000  // 5 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }
  
  getLocalAnalysis(audioData, analysisType) {
    // Use local JavaScript implementations
    if (analysisType === 'emotion') {
      return this.emotionDetector.analyzeFromFeatures(audioData);
    } else if (analysisType === 'validation') {
      return this.validateAnswerLocally(audioData);
    }
    // ... other analysis types
  }
}
```

### 6. CORS Configuration

Ensure the backend allows requests from your frontend:

Update `ml-backend/.env`:
```
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8080
```

Or update `app.py`:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

## Testing the Integration

### 1. Test Backend Health

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "operational",
  "components": {
    "audio": "ready",
    "emotion": "ready",
    "nlu": "ready",
    "irt": "ready"
  }
}
```

### 2. Test Intent Recognition

```bash
curl -X POST http://localhost:5000/api/nlu/intent \
  -H "Content-Type: application/json" \
  -d '{"text": "the answer is five"}'
```

### 3. Test Complete Analysis

```bash
curl -X POST http://localhost:5000/api/analyze/complete \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "test_student",
    "user_text": "five",
    "correct_answer": "5",
    "answer_type": "numeric",
    "item_params": {
      "difficulty": 0.5,
      "discrimination": 1.0,
      "guessing": 0.2
    }
  }'
```

### 4. Test from JavaScript

```javascript
// In browser console
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(data => console.log(data));
```

## Performance Optimization

### 1. Cache Responses

```javascript
class APICache {
  constructor(ttl = 300000) {  // 5 minutes
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  async get(key, fetcher) {
    if (this.cache.has(key)) {
      const { data, timestamp } = this.cache.get(key);
      if (Date.now() - timestamp < this.ttl) {
        return data;
      }
    }
    
    const data = await fetcher();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }
}
```

### 2. Batch Requests

```javascript
async batchAnalyze(analyses) {
  // Send multiple analyses in one request
  const response = await fetch(
    `${this.mlBackendUrl}/api/batch/analyze`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analyses })
    }
  );
  return response.json();
}
```

### 3. Use WebSockets for Real-time Updates

```javascript
const ws = new WebSocket('ws://localhost:5000/stream');
ws.onmessage = (event) => {
  const analysis = JSON.parse(event.data);
  // Process real-time analysis
};
```

## Production Deployment

### 1. Docker Setup

Create `ml-backend/Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:create_app()"]
```

### 2. Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3'
services:
  ml-backend:
    build: ./ml-backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - DEBUG=false
    volumes:
      - ./ml-backend/models:/app/models
      - ./ml-backend/data:/app/data
```

### 3. Environment Variables

Set production variables:
```bash
export DEBUG=false
export FLASK_ENV=production
export ML_BACKEND_URL=https://api.yourserver.com
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check CORS configuration in .env |
| Connection refused | Ensure backend is running on port 5000 |
| Timeout errors | Increase timeout, check network latency |
| Missing dependencies | Run `pip install -r requirements.txt` |
| Model not found | Verify models/ directory exists |

## Next Steps

1. **Implement additional ML models** for improved emotion detection
2. **Add WebSocket support** for real-time streaming
3. **Integrate database** for persistent storage
4. **Deploy to cloud** (AWS, GCP, Azure)
5. **Add monitoring and logging** for production
6. **Conduct user testing** and gather feedback

## References

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Librosa Documentation](https://librosa.org/)
- [scikit-learn Documentation](https://scikit-learn.org/)
- [Item Response Theory](https://en.wikipedia.org/wiki/Item_response_theory)
