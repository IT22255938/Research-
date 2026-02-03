# Voice Input/Output System - Complete Guide

## 📌 Overview

The Voice Integration System provides a complete solution for:
- ✅ **Speech Recognition** - Convert student speech to text (Web Speech API)
- ✅ **Text-to-Speech** - Multiple character voices with emotional tones
- ✅ **Real-time Transcription** - See what's being said as it's spoken
- ✅ **Answer Validation** - Automatic answer checking with fuzzy matching
- ✅ **Voice Feedback** - Character voices give instant feedback

---

## 🎯 Quick Start

### 1. **Import the Voice Integration**

```javascript
import { VoiceIntegration } from './src/audio/voice-integration.js';

// Create instance
const voice = new VoiceIntegration({
  defaultCharacter: 'sophie',
  language: 'en-US',
  enableRealTimeTranscription: true
});
```

### 2. **Ask a Question with Voice**

```javascript
// Ask question and narrate it
await voice.askQuestion('What is 2 + 3?', {
  character: 'sophie',
  narration: 'Let me ask you a math question. What is 2 plus 3?'
});
```

### 3. **Listen for Student's Voice Response**

```javascript
try {
  const response = await voice.listenForResponse({
    timeout: 15000  // 15 seconds
  });
  
  console.log('Student said:', response.text);
  console.log('Confidence:', response.confidence * 100 + '%');
} catch (error) {
  console.error('Error:', error.message);
}
```

### 4. **Validate Answer and Give Feedback**

```javascript
const expectedAnswers = ['5', 'five'];
const { isCorrect, feedback } = await voice.processAnswer(
  response.text,
  expectedAnswers,
  'sophie'
);

console.log('Is correct:', isCorrect);
console.log('Feedback:', feedback);
```

---

## 👥 Available Characters

| Character | Voice | Personality | Best For |
|-----------|-------|-------------|----------|
| 🧑‍🦰 **Sophie** | Female (child) | Friendly, encouraging | Questions & feedback |
| 🦸 **Buddy** | Male (child) | Energetic, playful | Celebrations & fun |
| 👨‍🏫 **Teacher** | Female (adult) | Patient, educational | Explanations |
| 🐉 **Dragon** | Male (fantasy) | Adventurous, mysterious | Adventures |
| 🧚 **Fairy** | Female (fantasy) | Magical, whimsical | Fantasy content |

---

## 😊 Emotional Tones

Each character can speak with different emotions:

| Emotion | Pitch | Speed | Use Case |
|---------|-------|-------|----------|
| `neutral` | Normal | Normal | Standard speech |
| `calm` | Lower | Slower | Questions, instructions |
| `encouraging` | Higher | Slower | Support, motivation |
| `celebratory` | Very High | Faster | Celebrations, achievements |
| `excited` | Very High | Very Fast | Announcements, energy |
| `gentle` | Lower | Slow | Comfort, errors |

---

## 🎤 Real-Time Transcription

The system shows what's being said in real-time:

```javascript
// Listen for interim updates
voice.on('transcription-update', (data) => {
  console.log('Interim:', data.text);
  console.log('Confidence:', data.confidence + '%');
  // Update UI in real-time
});

// Listen for final result
voice.on('transcription-complete', (data) => {
  console.log('Final:', data.text);
  console.log('Confidence:', data.confidence + '%');
});
```

---

## 💬 Speak Text

```javascript
// Simple speak
await voice.speak('Hello student!', {
  character: 'sophie',
  emotionalTone: 'encouraging'
});

// Speak as character (auto emotion)
await voice.speakAsCharacter(
  'Great job!',
  'buddy',
  'celebration'  // Automatically uses celebratory tone
);
```

---

## ✔️ Answer Validation

The system validates answers with multiple strategies:

```javascript
// Exact match: "five" === "five"
// Partial match: "five stars" contains "five"
// Fuzzy match: "fibe" is similar to "five"

const isCorrect = voice.validateAnswer(
  'five',
  ['5', 'five']
);
```

---

## 📢 Complete Activity Example

```javascript
import { VoiceIntegration } from './src/audio/voice-integration.js';

class MathActivity {
  constructor() {
    this.voice = new VoiceIntegration({
      defaultCharacter: 'sophie',
      timeout: 15000
    });
  }

  async runQuestion(question) {
    // 1. Ask question with voice
    await this.voice.askQuestion(question.text, {
      character: 'sophie',
      narration: question.narration
    });

    // 2. Listen for student response
    try {
      const response = await this.voice.listenForResponse();
      console.log('Student said:', response.text);

      // 3. Validate answer
      const { isCorrect, feedback } = await this.voice.processAnswer(
        response.text,
        question.expectedAnswers,
        'sophie'
      );

      // 4. Give feedback
      if (isCorrect) {
        console.log('✅ Correct!');
        return { isCorrect: true, xp: 10 };
      } else {
        console.log('❌ Incorrect');
        return { isCorrect: false, xp: 0 };
      }

    } catch (error) {
      console.error('Error:', error);
      return { isCorrect: false, xp: 0 };
    }
  }
}

// Usage
const activity = new MathActivity();
const result = await activity.runQuestion({
  text: 'What is 2 + 3?',
  narration: 'Let me ask you a math question. What is 2 plus 3?',
  expectedAnswers: ['5', 'five']
});
```

---

## 🎯 Events

Subscribe to voice events:

```javascript
// Listening started
voice.on('listening-started', (data) => {
  console.log('Microphone is active');
});

// Transcription updating in real-time
voice.on('transcription-update', (data) => {
  console.log('Current text:', data.text);
  console.log('Confidence:', data.confidence);
});

// Final transcription received
voice.on('transcription-complete', (data) => {
  console.log('Final answer:', data.text);
});

// Listening stopped
voice.on('listening-stopped', (data) => {
  console.log('Microphone stopped');
});

// Error occurred
voice.on('error', (error) => {
  console.error('Error:', error.message);
});

// Speech completed
voice.on('speech-complete', (data) => {
  console.log('Finished speaking:', data.text);
});

// Answer processed
voice.on('answer-processed', (data) => {
  console.log('Answer:', data.studentAnswer);
  console.log('Is correct:', data.isCorrect);
});
```

---

## 🛠️ Configuration Options

```javascript
const voice = new VoiceIntegration({
  // Language (en-US, es-ES, fr-FR, etc.)
  language: 'en-US',

  // Default character voice
  defaultCharacter: 'sophie',

  // Timeout for listening (ms)
  timeout: 15000,

  // Enable real-time transcription updates
  enableRealTimeTranscription: true,

  // Enable visual feedback UI updates
  enableVisualFeedback: true
});
```

---

## 📱 Browser Support

| Browser | Speech Recognition | Text-to-Speech | Status |
|---------|-------------------|-----------------|--------|
| Chrome | ✅ Full | ✅ Full | Fully supported |
| Edge | ✅ Full | ✅ Full | Fully supported |
| Safari | ✅ Full | ✅ Full | Fully supported |
| Firefox | ⚠️ Partial | ⚠️ Limited | Basic support |
| IE 11 | ❌ None | ❌ None | Not supported |

---

## 🔧 Troubleshooting

### "Microphone not working"
```javascript
// Check if voice is supported
if (!voice.isSupported()) {
  console.error('Voice features not supported');
}

// Check permissions
// Browser will prompt for microphone permission
```

### "No speech detected"
```javascript
// Increase timeout
const response = await voice.listenForResponse({
  timeout: 20000  // 20 seconds instead of 15
});

// Speak louder or closer to microphone
```

### "Text-to-speech not working"
```javascript
// Check if browser supports it
if (VoiceSynthesizer.isSupported()) {
  console.log('TTS is supported');
}

// Some browsers require user interaction first
// Click a button before speaking
```

### "Wrong confidence score"
```javascript
// Web Speech API confidence is browser-dependent
// Values range from 0 to 1 (0-100%)
// Lower scores may be more accurate for some browsers
```

---

## 🚀 Advanced Usage

### Change Language Dynamically

```javascript
voice.setLanguage('es-ES');  // Spanish
voice.setLanguage('fr-FR');  // French
voice.setLanguage('de-DE');  // German
```

### Get Available Options

```javascript
// Get character list
const characters = voice.getAvailableCharacters();
console.log(characters);  // ['sophie', 'buddy', 'teacher', 'dragon', 'fairy']

// Get emotions
const emotions = voice.getAvailableEmotions();
console.log(emotions);  // ['neutral', 'calm', 'encouraging', 'celebratory', ...]
```

### Stop All Voice Operations

```javascript
// Stop listening and speaking
voice.stopAll();
```

### Get Status

```javascript
const status = voice.getStatus();
console.log(status);
// {
//   initialized: true,
//   isListening: false,
//   language: 'en-US',
//   defaultCharacter: 'sophie',
//   lastTranscript: 'five',
//   lastConfidence: 0.95
// }
```

---

## 📊 File Structure

```
src/audio/
├── voice-input.js              # Low-level voice input (Web Speech API)
├── voice-integration.js        # Main unified interface (NEW)
├── speech-recognizer.js        # Speech recognition wrapper
├── text-to-speech.js          # Text-to-speech with characters
└── audio-processor.js         # Audio feature extraction
```

---

## 🎮 Demo

Test the complete system at:
```
http://localhost:3000/voice-demo.html
```

Features:
- 🎤 Real-time voice input demo
- 💬 Multiple character voices
- 😊 Emotional tone variations
- ✔️ Answer validation
- 📊 Live status panel

---

## 📚 Implementation Example in Activity

```javascript
// activities/math-adventure.js
import { VoiceIntegration } from '../audio/voice-integration.js';

export class MathAdventure {
  constructor() {
    this.voice = new VoiceIntegration({
      defaultCharacter: 'dragon',
      timeout: 15000
    });
    this.currentLevel = 1;
    this.score = 0;
  }

  async startActivity() {
    await this.voice.speakAsCharacter(
      'Welcome to the Math Adventure! I am the Dragon guide.',
      'dragon',
      'celebration'
    );

    // Run questions
    for (let i = 0; i < 5; i++) {
      await this.askQuestion();
    }

    // Show summary
    await this.voice.speakAsCharacter(
      `You earned ${this.score} points! Great job!`,
      'dragon',
      'celebration'
    );
  }

  async askQuestion() {
    const question = this.generateQuestion();

    // Ask with voice
    await this.voice.askQuestion(question.text, {
      character: 'dragon',
      narration: question.narration
    });

    // Listen for answer
    try {
      const response = await this.voice.listenForResponse();
      
      // Check answer
      const { isCorrect } = await this.voice.processAnswer(
        response.text,
        question.expectedAnswers,
        'dragon'
      );

      if (isCorrect) {
        this.score += 10;
      }
    } catch (error) {
      console.error('Question error:', error);
    }
  }

  generateQuestion() {
    // Generate based on current level
    return {
      text: `What is ${Math.random() * 10} + ${Math.random() * 10}?`,
      narration: 'Time for a math challenge!',
      expectedAnswers: ['15', 'fifteen']
    };
  }
}
```

---

## ✅ Checklist

- [x] Speech recognition with Web Speech API
- [x] Text-to-speech with character voices
- [x] Real-time transcription feedback
- [x] 5 character voices
- [x] 6 emotional tones
- [x] Answer validation with fuzzy matching
- [x] Event system for real-time updates
- [x] Browser compatibility handling
- [x] Error handling and user prompts
- [x] Demo HTML page
- [x] Complete documentation

---

## 📖 Related Files

- [speech-recognizer.js](./src/audio/speech-recognizer.js) - Low-level speech API
- [text-to-speech.js](./src/audio/text-to-speech.js) - TTS implementation
- [voice-input.js](./src/audio/voice-input.js) - Simple voice input
- [voice-demo.html](./voice-demo.html) - Interactive demo

---

**Version**: 1.0.0  
**Last Updated**: January 5, 2026  
**Status**: ✅ Complete & Production Ready
