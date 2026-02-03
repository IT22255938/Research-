# Voice Integration - Quick Reference

## 🚀 5-Second Setup

```javascript
import { VoiceIntegration } from './src/audio/voice-integration.js';
const voice = new VoiceIntegration();
```

## 🎯 Basic Operations

### Ask & Listen

```javascript
// Ask question
await voice.askQuestion('What is 2 + 3?');

// Listen for answer
const response = await voice.listenForResponse();
console.log(response.text);  // What student said
console.log(response.confidence);  // 0-1 confidence
```

### Validate & Feedback

```javascript
const { isCorrect, feedback } = await voice.processAnswer(
  response.text,
  ['5', 'five']
);
```

### Just Speak

```javascript
// Simple speak
await voice.speak('Hello!', {
  character: 'sophie',
  emotionalTone: 'encouraging'
});

// Auto-emotion speak
await voice.speakAsCharacter('Great job!', 'buddy', 'celebration');
```

## 👥 Characters

- 🧑‍🦰 `sophie` - Friendly female
- 🦸 `buddy` - Playful male  
- 👨‍🏫 `teacher` - Professional female
- 🐉 `dragon` - Adventurous male
- 🧚 `fairy` - Magical female

## 😊 Emotions

- `neutral` - Normal
- `calm` - Soft, slower
- `encouraging` - Warm, supportive
- `celebratory` - Excited, high-pitched
- `excited` - Very energetic
- `gentle` - Very calm

## 🎤 Events

```javascript
voice.on('listening-started', () => {});
voice.on('transcription-update', (data) => {});
voice.on('transcription-complete', (data) => {});
voice.on('listening-stopped', () => {});
voice.on('error', (error) => {});
```

## ⚙️ Configuration

```javascript
new VoiceIntegration({
  language: 'en-US',
  defaultCharacter: 'sophie',
  timeout: 15000,
  enableRealTimeTranscription: true,
  enableVisualFeedback: true
});
```

## 🛠️ Utilities

```javascript
voice.setLanguage('es-ES');
voice.getAvailableCharacters();
voice.getAvailableEmotions();
voice.stopAll();
voice.getStatus();
voice.isSupported();
```

## 📋 Complete Example

```javascript
const voice = new VoiceIntegration({ defaultCharacter: 'sophie' });

// 1. Ask question
await voice.askQuestion('What is 2 + 3?');

// 2. Listen
const response = await voice.listenForResponse();

// 3. Validate
const { isCorrect } = await voice.processAnswer(
  response.text,
  ['5', 'five']
);

console.log(isCorrect ? '✅ Correct!' : '❌ Wrong');
```

## 🧪 Test It

```
http://localhost:3000/voice-demo.html
```

---
**Quick Link**: [Full Guide](./VOICE_INTEGRATION_GUIDE.md)
