/**
 * Voice Integration Helper
 * Unified interface for voice input, output, and real-time feedback
 * Simplifies voice interaction for activities
 */

import { VoiceInput, VoiceFeedback, VoiceManager } from './voice-input.js';
import { VoiceSynthesizer } from './text-to-speech.js';
import { SpeechRecognizer } from './speech-recognizer.js';

export class VoiceIntegration {
  constructor(options = {}) {
    this.options = {
      language: options.language || 'en-US',
      defaultCharacter: options.defaultCharacter || 'sophie',
      timeout: options.timeout || 15000,
      enableRealTimeTranscription: options.enableRealTimeTranscription !== false,
      enableVisualFeedback: options.enableVisualFeedback !== false,
      ...options
    };

    this.isInitialized = false;
    this.synthesizer = null;
    this.recognizer = null;
    this.voiceManager = null;
    this.currentTranscript = '';
    this.currentConfidence = 0;
    this.listeners = {};

    this.initialize();
  }

  /**
   * Initialize all voice components
   */
  initialize() {
    try {
      // Initialize TTS
      this.synthesizer = new VoiceSynthesizer({
        language: this.options.language
      });

      // Initialize Speech Recognition (Web Speech API)
      this.recognizer = new SpeechRecognizer({
        language: this.options.language
      });

      // Setup recognizer event handlers
      this.setupRecognizerEvents();

      // Initialize voice manager for simplified API
      this.voiceManager = new VoiceManager();

      this.isInitialized = true;
      this.emit('initialized', { timestamp: Date.now() });
      console.log('✅ Voice Integration initialized');

      return true;
    } catch (error) {
      console.error('❌ Failed to initialize voice integration:', error);
      return false;
    }
  }

  /**
   * Setup event handlers for speech recognizer
   */
  setupRecognizerEvents() {
    this.recognizer.on('partial-result', (result) => {
      this.currentTranscript = result.text;
      this.currentConfidence = result.confidence;

      this.emit('transcription-update', {
        text: result.text,
        confidence: Math.round(result.confidence * 100),
        isFinal: false,
        timestamp: Date.now()
      });

      // Update UI if enabled
      if (this.options.enableRealTimeTranscription) {
        this.updateTranscriptionUI(result.text, result.confidence, false);
      }
    });

    this.recognizer.on('final-result', (result) => {
      this.currentTranscript = result.text;
      this.currentConfidence = result.confidence;

      this.emit('transcription-complete', {
        text: result.text,
        confidence: Math.round(result.confidence * 100),
        isFinal: true,
        timestamp: Date.now()
      });

      // Update UI if enabled
      if (this.options.enableRealTimeTranscription) {
        this.updateTranscriptionUI(result.text, result.confidence, true);
      }
    });

    this.recognizer.on('listening', () => {
      this.emit('listening-started', { timestamp: Date.now() });
      if (this.options.enableVisualFeedback) {
        this.showListeningUI();
      }
    });

    this.recognizer.on('stopped', () => {
      this.emit('listening-stopped', { timestamp: Date.now() });
      if (this.options.enableVisualFeedback) {
        this.hideListeningUI();
      }
    });

    this.recognizer.on('error', (error) => {
      this.emit('error', error);
      if (this.options.enableVisualFeedback) {
        this.showErrorUI(error);
      }
    });
  }

  /**
   * Listen for voice response
   */
  async listenForResponse(options = {}) {
    const listenOptions = {
      timeout: options.timeout || this.options.timeout,
      onTranscription: options.onTranscription,
      ...options
    };

    return new Promise((resolve, reject) => {
      try {
        // Start listening
        this.recognizer.startListening();

        // Setup completion handler
        const handleComplete = () => {
          this.recognizer.removeListener('final-result', handleComplete);
          clearTimeout(timeoutHandle);

          const result = {
            text: this.currentTranscript,
            confidence: this.currentConfidence,
            timestamp: Date.now()
          };

          resolve(result);
        };

        this.recognizer.once('final-result', handleComplete);

        // Setup timeout
        const timeoutHandle = setTimeout(() => {
          this.recognizer.removeListener('final-result', handleComplete);
          this.recognizer.stopListening();

          reject(new Error('Voice input timeout'));
        }, listenOptions.timeout);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Speak text as character with emotion
   */
  async speak(text, options = {}) {
    const speakOptions = {
      character: options.character || this.options.defaultCharacter,
      emotionalTone: options.emotionalTone || 'neutral',
      volume: options.volume || 1.0,
      ...options
    };

    try {
      const result = await this.synthesizer.speak(text, speakOptions);
      this.emit('speech-complete', { text, ...result });
      return result;
    } catch (error) {
      this.emit('speech-error', { text, error });
      throw error;
    }
  }

  /**
   * Speak as character (with automatic emotion based on context)
   */
  async speakAsCharacter(text, character = null, context = 'neutral') {
    const charToUse = character || this.options.defaultCharacter;
    return this.speak(text, {
      character: charToUse,
      emotionalTone: this.mapContextToEmotion(context)
    });
  }

  /**
   * Ask question with voice narration
   */
  async askQuestion(questionText, characterOptions = {}) {
    const character = characterOptions.character || this.options.defaultCharacter;
    const narrateText = characterOptions.narration || questionText;

    try {
      // Speak the question
      await this.speak(narrateText, {
        character,
        emotionalTone: 'calm',
        rate: 0.8 // Slightly slower for clarity
      });

      // Emit event
      this.emit('question-asked', {
        text: questionText,
        character,
        timestamp: Date.now()
      });

      return true;
    } catch (error) {
      console.error('Failed to ask question:', error);
      return false;
    }
  }

  /**
   * Process answer with validation and feedback
   */
  async processAnswer(studentText, expectedAnswers = [], character = null) {
    const charToUse = character || this.options.defaultCharacter;

    // Validate answer
    const isCorrect = this.validateAnswer(studentText, expectedAnswers);

    // Give feedback
    const feedbackText = isCorrect
      ? this.getPositiveFeedback()
      : this.getNegativeFeedback(expectedAnswers[0]);

    try {
      await this.speak(feedbackText, {
        character: charToUse,
        emotionalTone: isCorrect ? 'celebratory' : 'encouraging'
      });

      this.emit('answer-processed', {
        studentAnswer: studentText,
        isCorrect,
        expectedAnswers,
        timestamp: Date.now()
      });

      return { isCorrect, feedback: feedbackText };
    } catch (error) {
      console.error('Failed to process answer:', error);
      return { isCorrect, feedback: 'Let me try again!' };
    }
  }

  /**
   * Validate student answer against expected answers
   */
  validateAnswer(studentText, expectedAnswers) {
    if (!studentText || !expectedAnswers || expectedAnswers.length === 0) {
      return false;
    }

    const normalized = studentText.toLowerCase().trim();

    // Exact match
    if (expectedAnswers.some(ans => ans.toLowerCase() === normalized)) {
      return true;
    }

    // Partial match (contains)
    if (expectedAnswers.some(ans => normalized.includes(ans.toLowerCase()))) {
      return true;
    }

    // Fuzzy match (simple levenshtein)
    if (expectedAnswers.some(ans => this.fuzzyMatch(normalized, ans.toLowerCase()))) {
      return true;
    }

    return false;
  }

  /**
   * Simple fuzzy matching
   */
  fuzzyMatch(str1, str2, threshold = 0.8) {
    const len1 = str1.length;
    const len2 = str2.length;
    const maxLen = Math.max(len1, len2);

    let matches = 0;
    for (let i = 0; i < Math.min(len1, len2); i++) {
      if (str1[i] === str2[i]) matches++;
    }

    return matches / maxLen >= threshold;
  }

  /**
   * Map context to emotional tone
   */
  mapContextToEmotion(context) {
    const contextMap = {
      'question': 'calm',
      'correct': 'celebratory',
      'incorrect': 'encouraging',
      'encouragement': 'encouraging',
      'celebration': 'celebratory',
      'explanation': 'calm',
      'feedback': 'neutral',
      'error': 'gentle',
      'alert': 'excited'
    };

    return contextMap[context] || 'neutral';
  }

  /**
   * Get positive feedback phrase
   */
  getPositiveFeedback() {
    const phrases = [
      'Excellent! You got it right!',
      'Great job! That is correct!',
      'Perfect! Well done!',
      'Yes! You are a star!',
      'Fantastic! You nailed it!',
      'That is absolutely correct! Amazing!',
      'You are so smart! That is right!',
      'Wonderful! You got it perfect!',
      'Awesome work!',
      'Super! Keep it up!'
    ];

    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  /**
   * Get negative feedback phrase
   */
  getNegativeFeedback(correctAnswer) {
    const phrases = [
      `Not quite. The answer is ${correctAnswer}. Try again!`,
      `Oops! That is not right. The answer is ${correctAnswer}. You can do it!`,
      `Not that one. The answer is ${correctAnswer}. Try the next question!`,
      `That was not right. The correct answer is ${correctAnswer}. Good try!`,
      `Let me help you. The answer is ${correctAnswer}. No worries!`
    ];

    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  /**
   * Update real-time transcription UI
   */
  updateTranscriptionUI(text, confidence, isFinal) {
    const element = document.getElementById('voice-transcription');
    if (!element) return;

    const confidencePercent = Math.round(confidence * 100);
    const status = isFinal ? '✅' : '📝';

    element.innerHTML = `
      <div class="voice-feedback">
        <p class="transcription-text">${status} ${text}</p>
        <p class="confidence-score">Confidence: ${confidencePercent}%</p>
      </div>
    `;
  }

  /**
   * Show listening UI
   */
  showListeningUI() {
    const element = document.getElementById('voice-feedback');
    if (!element) return;

    element.innerHTML = `
      <div class="listening-status">
        <span class="pulse-dot"></span>
        <p>🎤 Listening...</p>
      </div>
    `;
    element.classList.add('listening');
  }

  /**
   * Hide listening UI
   */
  hideListeningUI() {
    const element = document.getElementById('voice-feedback');
    if (element) {
      element.classList.remove('listening');
    }
  }

  /**
   * Show error UI
   */
  showErrorUI(error) {
    const element = document.getElementById('voice-feedback');
    if (!element) return;

    const errorMessage = this.getErrorMessage(error);
    element.innerHTML = `
      <div class="error-status">
        <p>❌ ${errorMessage}</p>
      </div>
    `;
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(error) {
    const messages = {
      'no-speech': 'I did not hear anything. Please speak louder!',
      'timeout': 'Time is up! Moving to next question.',
      'network': 'Connection error. Please try again!',
      'not-allowed': 'Microphone permission needed!',
      'audio': 'Audio input error. Check your microphone!'
    };

    return messages[error.code] || 'Something went wrong. Try again!';
  }

  /**
   * Stop all voice operations
   */
  stopAll() {
    if (this.recognizer && this.recognizer.isListening) {
      this.recognizer.stopListening();
    }
    if (this.synthesizer) {
      this.synthesizer.stop();
    }
  }

  /**
   * Check if voice is supported
   */
  isSupported() {
    return SpeechRecognizer.isSupported() && VoiceSynthesizer.isSupported();
  }

  /**
   * Get available characters
   */
  getAvailableCharacters() {
    return this.synthesizer ? this.synthesizer.getAvailableCharacters() : [];
  }

  /**
   * Get available emotional tones
   */
  getAvailableEmotions() {
    return this.synthesizer ? this.synthesizer.getAvailableEmotionalTones() : [];
  }

  /**
   * Set language
   */
  setLanguage(lang) {
    this.options.language = lang;
    if (this.recognizer) {
      this.recognizer.setLanguage(lang);
    }
    if (this.synthesizer) {
      this.synthesizer.options.language = lang;
    }
  }

  /**
   * Event emitter pattern
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.removeListener(event, wrapper);
    };
    this.on(event, wrapper);
  }

  removeListener(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      isListening: this.recognizer?.isListening || false,
      language: this.options.language,
      defaultCharacter: this.options.defaultCharacter,
      lastTranscript: this.currentTranscript,
      lastConfidence: this.currentConfidence
    };
  }
}

// Export singleton instance for global use
export const voiceIntegration = new VoiceIntegration();

export default VoiceIntegration;
