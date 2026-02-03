# Quick Start Guide

## Installation

### Prerequisites
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Modern browser** - Chrome, Firefox, or Edge (with Web Audio/Web Speech API support)
- **Microphone** - For speech input

### Setup

```bash
# 1. Clone or navigate to project
cd voice-learning-module

# 2. Install dependencies
npm install

# 3. Configure environment
cp configs/default.env .env

# 4. Start development server
npm run dev
```

---

## Basic Usage

### Create a Learning Session

```javascript
import { VoiceLearningModule } from './src/index.js';

// Initialize module
const learningModule = new VoiceLearningModule({
  userId: 'child-001',
  language: 'en-US',
  activities: ['counting-adventure'],
  adaptiveMode: true,
  emotionDetection: true,
  debug: false
});

// Initialize (requests microphone access)
await learningModule.initialize();

// Start session
const session = await learningModule.startSession({
  activityId: 'counting-adventure',
  duration: 10 * 60 * 1000 // 10 minutes
});

// Run activity loop
const question = {
  id: 'q1',
  prompt: 'How many apples do you see?',
  expectedAnswers: ['five', '5'],
  difficulty: 1
};

const response = await learningModule.presentQuestion(question);

console.log(response);
// {
//   questionId: 'q1',
//   userResponse: 'five',
//   isCorrect: true,
//   responseTime: 3240,
//   emotionalState: { confidence: 0.85, ... },
//   ...
// }

// End session
const result = await learningModule.endSession();

console.log(result.summary);
// {
//   totalQuestions: 10,
//   correctAnswers: 8,
//   accuracy: 80,
//   sessionDuration: 8.5,
//   closingMessage: "..."
// }
```

---

## Key Features

### 1. Speech Recognition
Automatically transcribe child's voice:

```javascript
const recognizer = learningModule.modules.speechRecognizer;

recognizer.on('listening', () => console.log('Listening...'));
recognizer.on('partial-result', (result) => console.log(result.text));
recognizer.on('final-result', (result) => {
  console.log(`Heard: "${result.text}" (confidence: ${result.confidence})`);
});
recognizer.on('error', (error) => console.error(error.message));

await recognizer.startListening();
// ... child speaks ...
recognizer.stopListening();
```

### 2. Emotion Detection
Analyze emotional state from voice:

```javascript
const emotionDetector = learningModule.modules.emotionDetector;

const audioBuffer = new Float32Array(/* raw audio data */);
const analysis = emotionDetector.analyzeAudio(audioBuffer, 16000);

console.log(analysis);
// {
//   confidence: 0.85,
//   frustration: 0.2,
//   engagement: 0.9,
//   dominantEmotion: 'engaged',
//   prosody: {
//     fundamentalFrequency: 240,
//     energy: -25,
//     speechRate: 150
//   }
// }
```

### 3. Adaptive Difficulty
Questions automatically adjust based on performance:

```javascript
const adaptiveEngine = learningModule.modules.adaptiveEngine;

// After each response
adaptiveEngine.updatePerformance({
  isCorrect: true,
  difficulty: 1,
  responseTime: 3000,
  confidence: 0.85,
  emotionalState: { frustration: 0.2 }
});

// Get next difficulty
const nextDifficulty = adaptiveEngine.getNextQuestionDifficulty();
console.log(nextDifficulty); // Adjusted based on performance

// Get statistics
const stats = adaptiveEngine.getStatistics();
console.log(stats);
// {
//   accuracy: 0.85,
//   abilityEstimate: 1.2,
//   skillLevel: 'Advanced',
//   ...
// }
```

### 4. Text-to-Speech
Generate character voices:

```javascript
const synthesizer = learningModule.modules.voiceSynthesizer;

await synthesizer.speak(
  'Welcome to the counting adventure!',
  {
    character: 'sophie',
    emotionalTone: 'encouraging',
    pace: 'normal'
  }
);
```

### 5. Session Analytics
Track learning progress:

```javascript
const stats = learningModule.getSessionStats();

console.log(stats);
// {
//   sessionId: 'xxx',
//   duration: 540000,
//   questionCount: 10,
//   performance: {
//     accuracy: 0.8,
//     abilityEstimate: 1.1,
//     skillLevel: 'Advanced'
//   },
//   emotionalTrend: {
//     averageConfidence: 0.82,
//     averageFrustration: 0.15,
//     dominantEmotions: [...]
//   }
// }
```

---

## Available Activities

### Counting Adventure
Story-driven counting for ages 4-8:
- 5-15 adaptive questions
- Number recognition and basic arithmetic
- Difficulty range: 1-5

**Load it:**
```javascript
await learningModule.startSession({
  activityId: 'counting-adventure'
});
```

### Number Recognition *(Coming Soon)*
Identify and name numbers 1-20

### Basic Math *(Coming Soon)*
Simple addition and subtraction

---

## Customizing Activities

### Create a Custom Activity

```javascript
// src/activities/my-activity.js
export const myActivity = {
  id: 'my-custom-activity',
  name: 'My Learning Activity',
  targetAge: [5, 10],
  
  questionBank: [
    {
      id: 'q1',
      difficulty: 1,
      prompt: 'What is your question?',
      expectedAnswers: ['answer1', 'answer2'],
      hint: 'A helpful hint...',
      feedback: {
        correct: 'Great job!',
        incorrect: 'Not quite, try again!'
      }
    },
    // More questions...
  ],
  
  rewards: {
    badges: [
      {
        id: 'first-badge',
        name: 'First Badge',
        description: 'Complete the activity',
        condition: { minQuestions: 5 }
      }
    ]
  }
};

export default myActivity;
```

Then use it:
```javascript
import myActivity from './src/activities/my-activity.js';

// Register it with the module
learningModule.registerActivity(myActivity);

// Start session with it
await learningModule.startSession({
  activityId: 'my-custom-activity'
});
```

---

## Debugging

### Enable Debug Mode

```javascript
const learningModule = new VoiceLearningModule({
  debug: true  // Enables detailed logging
});
```

### View Logs

```javascript
import { logger } from './src/utils/logger.js';

// Access all logs
console.log(logger.getLogs());

// Export logs for analysis
const logsJSON = logger.exportLogs();
```

### Check Module Status

```javascript
// Speech recognition status
console.log(learningModule.modules.speechRecognizer.getStatus());

// Adaptive engine statistics
console.log(learningModule.modules.adaptiveEngine.getStatistics());

// Emotion detection trends
console.log(learningModule.modules.emotionDetector.getEmotionalTrend());
```

---

## Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
npm test -- tests/unit/audio/speech-recognizer.test.js
```

### Test Audio Recording
```bash
npm run test:audio
```

### Test Emotion Detection
```bash
npm run test:emotion
```

---

## Troubleshooting

### Microphone Not Working
1. Check browser permissions
2. Ensure HTTPS (if deployed)
3. Check browser console for errors

### Speech Recognition Not Recognizing
1. Speak clearly and at natural pace
2. Check microphone quality
3. Verify language setting matches

### Emotion Detection Inaccurate
1. Ensure sufficient audio data
2. Check background noise levels
3. Calibrate baseline thresholds per user

---

## Performance Tips

### Optimize for Mobile
```javascript
const learningModule = new VoiceLearningModule({
  emotionDetection: false, // Disable if not needed
  debug: false
});
```

### Reduce Memory Usage
```javascript
// Clear history periodically
learningModule.modules.emotionDetector.reset();
learningModule.modules.adaptiveEngine.reset();
```

### Batch Operations
```javascript
// Process multiple questions efficiently
for (const question of questions) {
  const response = await learningModule.presentQuestion(question);
  // Adaptive engine updates automatically
}
```

---

## Next Steps

1. **Explore Activities**: Check `src/activities/` for more examples
2. **Review Architecture**: See `docs/ARCHITECTURE.md`
3. **Read Implementation Guide**: See `docs/IMPLEMENTATION_GUIDE.md`
4. **Run Tests**: `npm test`
5. **Contribute**: Create new activities or modules!

---

## Support & Documentation

- **Architecture**: `docs/ARCHITECTURE.md`
- **Implementation Guide**: `docs/IMPLEMENTATION_GUIDE.md`
- **API Reference**: `docs/API.md` (coming soon)
- **Research Methodology**: `docs/RESEARCH_METHODOLOGY.md` (coming soon)

---

## License

MIT License - See LICENSE file

---

**Questions?** Check the docs or create an issue in the repository.
