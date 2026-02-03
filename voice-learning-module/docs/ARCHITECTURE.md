# System Architecture Documentation

## Overview

The Voice-Interactive Learning Module follows a modular, event-driven architecture designed for:
- **Real-time responsiveness** - Audio processing with minimal latency
- **Modularity** - Independent components with clear interfaces
- **Extensibility** - Easy to add new activities, voices, and features
- **Accessibility** - Audio-first design with assistive technology support
- **Research capability** - Comprehensive data collection for analysis

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│              (Voice Learning Session Manager)                │
└──────────────────────────────────────────────────────────────┘
                              ▲
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Audio Input   │  │   Activity       │  │  Gamification    │
│   Pipeline      │  │   Engine         │  │  System          │
├─────────────────┤  ├──────────────────┤  ├──────────────────┤
│• Microphone     │  │• Dialogue Flow   │  │• Progress Track  │
│• Speech-to-Text│  │• Answer Validate │  │• Rewards         │
│• Audio Process │  │• Content Render  │  │• Badges/Levels   │
└────────┬────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                    │                     │
         └────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Adaptive       │  │  Emotion         │  │  Audio Output    │
│  Difficulty     │  │  Detection       │  │  Pipeline        │
│  Engine         │  │                  │  │                  │
├─────────────────┤  ├──────────────────┤  ├──────────────────┤
│• IRT Scaling    │  │• Prosody Analyze │  │• Text-to-Speech  │
│• Performance    │  │• Confidence Scor │  │• Voice Effects   │
│• Path Planning  │  │• Emotion Class   │  │• Audio Mix       │
└────────┬────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                    │                     │
         └────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│         (Database, Analytics, Session Management)            │
└──────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Audio Input Pipeline (`src/audio/`)

**Responsibility**: Capture, process, and transcribe child's voice input

#### Components:
- **SpeechRecognizer** - Real-time speech-to-text
  - Optimized for children's speech patterns
  - Handles background noise
  - Returns transcription + confidence score
  
- **AudioProcessor** - Pre-processing and feature extraction
  - Noise filtering and normalization
  - Feature extraction (MFCC, prosody)
  - Real-time audio analysis
  
- **AcousticAnalyzer** - Extract raw audio features
  - Pitch detection (fundamental frequency)
  - Energy/volume analysis
  - Speech rate detection
  - Prosody patterns

#### Data Flow:
```
Microphone Audio → Audio Buffer → Feature Extraction → Speech Recognition
                                        ↓
                              Emotion Detection Module
```

#### API:
```javascript
class SpeechRecognizer {
  async startListening(options?: RecognizerOptions): Promise<void>
  async stopListening(): Promise<RecognitionResult>
  on('partial-result', callback: (text: string) => void)
  on('final-result', callback: (result: RecognitionResult) => void)
}

interface RecognitionResult {
  text: string;
  confidence: number;           // 0-1
  isFinal: boolean;
  audioBuffer: Float32Array;    // Raw audio for emotion analysis
  duration: number;             // milliseconds
  language: string;
}
```

---

### 2. Activity Engine (`src/activities/`)

**Responsibility**: Manage learning activities, dialogue flows, and content delivery

#### Components:
- **ActivityEngine** - Orchestrates activity execution
  - Loads activity definitions
  - Manages state and context
  - Coordinates with other modules
  
- **DialogueFlow** - Manages conversation structure
  - Branching logic based on responses
  - Dynamic question generation
  - Contextual feedback generation
  
- **AnswerValidator** - Validates child's responses
  - Exact match validation
  - Fuzzy matching for variations
  - Semantic understanding
  
- **ContentRenderer** - Prepares content for output
  - Activity-specific templating
  - Dynamic content insertion
  - Accessibility formatting

#### Activity Definition Structure:
```javascript
{
  id: 'counting-adventure',
  name: 'Story Counting Adventure',
  targetAge: [4, 8],
  difficulty: 'adaptive',
  skills: ['counting', 'number-recognition'],
  
  initialScene: {
    narration: "Welcome to counting adventure!",
    actions: ['play-intro-music', 'introduce-character']
  },
  
  questions: [
    {
      id: 'q1',
      difficultyLevel: 1,
      prompt: "How many apples do you see?",
      expectedAnswers: ['one', '1'],
      fuzzyMatch: true,
      feedback: {
        correct: "Great! You counted them perfectly!",
        incorrect: "Let me count again with you..."
      }
    }
  ]
}
```

---

### 3. Adaptive Difficulty Engine (`src/adaptive-engine/`)

**Responsibility**: Dynamically adjust learning difficulty based on performance

#### Algorithm: Item Response Theory (IRT) Adapted

The engine tracks:
- **Ability Estimate (θ)**: Child's current learning level
- **Item Difficulty (b)**: Question difficulty parameter
- **Discrimination (a)**: How well questions differentiate ability
- **Guessing Parameter (c)**: Probability of correct random guess

#### Update Process:
1. Child answers question
2. Record response + metadata (time, emotion, confidence)
3. Calculate response likelihood under IRT model
4. Update ability estimate using Bayesian updating
5. Select next question difficulty to target 50-65% success rate

#### Components:
- **PerformanceAnalyzer** - Tracks metrics
  - Accuracy rate
  - Response time patterns
  - Error analysis
  
- **DifficultyScaler** - Calculates next difficulty
  - IRT-based ability estimation
  - Question selection algorithm
  - Adaptive sequencing

#### API:
```javascript
class AdaptiveDifficultyEngine {
  updatePerformance(response: PerformanceMetric): void
  getNextQuestionDifficulty(): number
  getCurrentAbilityEstimate(): number
  getPredictedSuccessProbability(difficulty: number): number
  generatePersonalizedPath(session: SessionData): ActivityQuestion[]
}

interface PerformanceMetric {
  questionId: string;
  isCorrect: boolean;
  responseTime: number;
  confidence: number;         // 0-1 from emotion detection
  difficulty: number;
  emotionalState: EmotionalAnalysis;
}
```

---

### 4. Emotion Detection Module (`src/emotion-detection/`)

**Responsibility**: Analyze emotional state from voice characteristics

#### Analysis Dimensions:

1. **Confidence Level** (Low→High)
   - Hesitation markers (um, uh, pauses)
   - Filler word count
   - Speech fluency
   - Formant stability

2. **Frustration Level** (Low→High)
   - Pitch increase
   - Speaking rate acceleration
   - Volume increase
   - Vocal tension (formant compression)

3. **Engagement Level** (Low→High)
   - Energy (RMS energy)
   - Intonation variation
   - Enthusiasm markers
   - Response latency

#### Feature Extraction:
```
Audio Signal
    ↓
[Pre-emphasis & Windowing]
    ↓
[FFT → Spectrogram]
    ↓
[Feature Extraction]
    ├── Pitch (F0) via autocorrelation
    ├── Energy (RMS)
    ├── MFCCs (Mel-Frequency Cepstral Coefficients)
    ├── Zero Crossing Rate
    └── Spectral Centroid
    ↓
[Emotion Classification Model]
    ↓
[Emotional State Scores]
```

#### Components:
- **ProsodyAnalyzer** - Extract prosodic features
  - Pitch tracking
  - Energy computation
  - Duration analysis
  
- **EmotionClassifier** - Map features to emotions
  - ML-based classification
  - Continuous valence/arousal estimation
  
- **SentimentScorer** - Overall emotional score
  - Combines multiple dimensions
  - Tracks emotional trends

#### API:
```javascript
class EmotionDetector {
  analyzeAudio(audioBuffer: Float32Array, sampleRate: number): EmotionalAnalysis
}

interface EmotionalAnalysis {
  timestamp: number;
  confidence: number;           // 0-1
  frustration: number;          // 0-1
  engagement: number;           // 0-1
  arousal: number;              // 0-1 (energy level)
  valence: number;              // 0-1 (positivity)
  dominantEmotion: 'calm' | 'engaged' | 'frustrated' | 'confused';
  prosody: {
    fundamentalFrequency: number;  // Hz
    energy: number;                 // dB
    speechRate: number;             // words/min
    voiceTensionIndex: number;      // 0-1
  };
}
```

---

### 5. Audio Output Pipeline (`src/audio/text-to-speech.js`)

**Responsibility**: Generate natural, emotionally-aware voice output

#### Features:
- Multiple character voices (age/gender appropriate)
- Emotional tone variations
- Sound effect integration
- Real-time streaming

#### Components:
- **VoiceSynthesizer** - TTS engine
  - Character selection
  - Emotional prosody adjustment
  - Audio quality optimization
  
- **AudioMixer** - Combine voice + effects
  - Layering
  - Volume normalization
  - Spatialization (optional)

#### API:
```javascript
class VoiceSynthesizer {
  async speak(text: string, options?: SpeechOptions): Promise<AudioBuffer>
}

interface SpeechOptions {
  character: 'sophie' | 'buddy' | 'teacher';
  emotionalTone: 'encouraging' | 'neutral' | 'celebratory';
  pace: 'slow' | 'normal' | 'fast';
  pitchVariation: number;
  language: string;
}
```

---

### 6. Gamification System (`src/gamification/`)

**Responsibility**: Maintain engagement through rewards and progression

#### Components:
- **ProgressTracker** - Sessions, lessons completed, milestones
  - Total playtime
  - Accuracy trends
  - Skill mastery levels
  
- **RewardManager** - Issue rewards based on performance
  - Badge conditions
  - Point calculation
  - Celebration timing
  
- **CharacterManager** - Personality and progression
  - Companion/mascot progression
  - Unlockable features
  - Personalization

#### Reward System:
```javascript
enum RewardType {
  BADGE = 'badge',
  POINTS = 'points',
  LEVEL_UP = 'level_up',
  SOUND_EFFECT = 'sound_effect',
  CHARACTER_UNLOCK = 'character_unlock'
}

interface Reward {
  type: RewardType;
  name: string;
  description: string;
  emotionalContext: string;  // Motivational message
  audioFeedback: string;     // Celebration sound
}

// Badge Examples:
// - "First Steps" - Complete first activity
// - "Counter" - Get 10 counting questions correct
// - "Speedster" - Answer 5 questions in under 3 seconds
// - "Perseverer" - Answer correctly after initial error
// - "Confident Voice" - High emotion confidence rating
```

---

### 7. Data Layer (`src/data-layer/`)

**Responsibility**: Persistent storage and analytics

#### Data Models:

```javascript
// User Profile
{
  userId: string;
  name: string;
  age: number;
  profile: {
    baselineAbility: number;
    learningStyle: string;
    preferredCharacter: string;
    language: string;
  };
}

// Session
{
  sessionId: string;
  userId: string;
  startTime: timestamp;
  endTime: timestamp;
  duration: number;
  activityId: string;
  questions: ResponseData[];
  emotionalTrends: EmotionalAnalysis[];
  performanceMetrics: PerformanceMetric[];
}

// Response Data
{
  questionId: string;
  userResponse: string;
  isCorrect: boolean;
  responseTime: number;
  difficulty: number;
  emotionalState: EmotionalAnalysis;
  timestamp: number;
}
```

#### Analytics Capabilities:
- Learning curve analysis
- Emotion-performance correlations
- Skill progression tracking
- Optimal difficulty identification
- Personalized recommendations

---

### 8. Accessible UI/UX (`src/ui/`)

**Responsibility**: Provide accessible interface for children and caregivers

#### Design Principles:
- **Audio-First**: Primary interaction via voice
- **Visual Minimal**: Optional visual feedback (large text, simple colors)
- **Assistive Tech Ready**: Screen reader compatible
- **Voice Commands**: Control via spoken commands

#### Components:
- **AccessibilityManager** - WCAG compliance
  - Screen reader integration
  - Keyboard navigation
  - High contrast modes
  
- **VoiceCommander** - Voice control interface
  - Command recognition
  - Fallback modes
  
- **SessionUI** - Activity display
  - Progress indicators
  - Minimal visual design

---

## Data Flow Diagrams

### Learning Session Flow
```
START SESSION
    │
    ├→ Initialize User Profile
    ├→ Load Activity Content
    ├→ Set Initial Difficulty Level
    │
┌───┴─────────────────────────────┐
│    MAIN ACTIVITY LOOP           │
│                                  │
│  1. Generate Question            │
│     └→ Use adaptive difficulty   │
│                                  │
│  2. Narrate Question             │
│     └→ Text-to-Speech            │
│                                  │
│  3. Listen for Response          │
│     ├→ Record Audio              │
│     ├→ Extract Features          │
│     └→ Detect Emotion            │
│                                  │
│  4. Transcribe Audio             │
│     └→ Speech-to-Text            │
│                                  │
│  5. Validate Answer              │
│     └→ Check Correctness         │
│                                  │
│  6. Analyze Performance          │
│     ├→ Update Ability Estimate   │
│     ├→ Calculate Metrics         │
│     └→ Assess Emotional State    │
│                                  │
│  7. Generate Feedback            │
│     ├→ Select Reward (if earned) │
│     ├→ Provide Encouragement     │
│     └→ Update Gamification       │
│                                  │
│  8. Store Response Data          │
│     └→ Database Write            │
│                                  │
│  9. Decide Next Action           │
│     ├─ Continue? → Back to 1     │
│     └─ End Session? ↓            │
│                                  │
└────────────────────────────────┘
    │
    ├→ Generate Session Summary
    ├→ Calculate Rewards
    ├→ Update Learning Path
    │
    END SESSION
```

### Emotion Detection Pipeline
```
Audio Input
    │
    ├─ Digital Signal Processing
    │  ├─ Windowing (Hamming)
    │  ├─ FFT (1024 samples)
    │  └─ Spectral Analysis
    │
    ├─ Feature Extraction
    │  ├─ Fundamental Frequency (Pitch)
    │  ├─ Mel-Frequency Cepstral Coefficients (MFCC)
    │  ├─ Root Mean Square Energy (RMS)
    │  ├─ Zero Crossing Rate (ZCR)
    │  └─ Spectral Properties
    │
    ├─ Temporal Modeling
    │  ├─ Speech Rate Analysis
    │  ├─ Pause Detection
    │  └─ Pitch Contour
    │
    ├─ Machine Learning Classifier
    │  ├─ Feature Normalization
    │  ├─ Model Inference
    │  └─ Confidence Scoring
    │
    └─ Emotional Output
       ├─ Confidence: 0-1
       ├─ Frustration: 0-1
       ├─ Engagement: 0-1
       ├─ Dominant Emotion
       └─ Prosody Metrics
```

---

## Integration Points

### Module Communication
- **Event-Driven**: Components emit and listen to events
- **Message Queue**: Async task handling
- **Shared Context**: Session state management

### External Services (Optional)
- Cloud STT/TTS (fallback to offline)
- ML Model APIs (emotion classification)
- Analytics backends (research data)

---

## Performance Considerations

### Latency Requirements
- Speech recognition: <500ms for transcription
- Emotion analysis: <200ms
- TTS generation: <1s
- Total response cycle: <3-5 seconds

### Optimization Strategies
- Local processing (no cloud requirement)
- Audio buffer management
- Model optimization (quantization, pruning)
- Async processing with event streams

---

## Security & Privacy

### Data Protection
- Local-first processing (no automatic cloud uploads)
- Encrypted persistent storage
- Session-based temporary buffers
- Parental consent management

### COPPA/GDPR Compliance
- No behavioral tracking without consent
- Data retention policies
- Export/deletion capabilities
- Privacy-by-design

---

## Extension Points

Future enhancements:
1. **Multi-language Support**: Easy language model swapping
2. **Custom Activities**: Plugin architecture for new activities
3. **ML Model Updates**: Model versioning and A/B testing
4. **Caregiver Dashboard**: Progress monitoring interface
5. **Remote Learning**: Network-based session coordination

