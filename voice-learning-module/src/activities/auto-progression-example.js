/**
 * Auto-Progression Example Activity
 * Demonstrates how to use auto-progression to move to next question
 * when student answers correctly
 */

import { ActivityLauncher } from './activity-launcher.js';
import { AutoProgressionManager, setupAutoProgression, injectAutoProgressionStyles } from './auto-progression.js';
import { VoiceIntegration } from '../audio/voice-integration.js';

export class AutoProgressionActivity {
  constructor(activity, studentId) {
    this.activity = activity;
    this.studentId = studentId;
    this.launcher = null;
    this.progressionManager = null;
    this.voice = new VoiceIntegration();
    this.isRunning = false;
    this.currentQuestion = null;
  }

  /**
   * Initialize the activity with auto-progression
   */
  async initialize() {
    try {
      console.log('🚀 Initializing auto-progression activity...');

      // Create activity launcher
      this.launcher = new ActivityLauncher(
        this.activity,
        this.studentId,
        1,
        null // No voice manager passed here
      );

      // Enable auto-progression
      this.launcher.setAutoProgression(true, 2000); // 2 second delay

      // Create progression manager
      this.progressionManager = new AutoProgressionManager(this.launcher);

      // Inject styles
      injectAutoProgressionStyles();

      // Setup callbacks for progression
      this.launcher.setProgressionCallbacks(
        (nextQuestion) => this.displayQuestion(nextQuestion),
        (summary) => this.endActivity(summary)
      );

      // Start session
      await this.launcher.startSession();

      console.log('✅ Activity initialized with auto-progression');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize:', error);
      return false;
    }
  }

  /**
   * Start the activity
   */
  async start() {
    if (!this.launcher) {
      await this.initialize();
    }

    this.isRunning = true;
    console.log('▶️ Activity started');

    // Display first question
    const firstQuestion = this.launcher.getNextQuestion();
    this.displayQuestion(firstQuestion);
  }

  /**
   * Display question on screen
   */
  displayQuestion(question) {
    this.currentQuestion = question;
    console.log(`📝 Question ${this.launcher.currentQuestionIndex + 1}: ${question.prompt}`);

    // Get UI elements
    const questionElement = document.getElementById('question-text');
    const feedbackElement = document.getElementById('feedback-area');
    const inputElement = document.getElementById('voice-input');

    if (!questionElement) {
      console.error('Question element not found');
      return;
    }

    // Display question
    questionElement.innerHTML = `
      <div class="question-container">
        <div class="question-number">Question ${this.launcher.currentQuestionIndex + 1}</div>
        <div class="question-text">${question.prompt}</div>
        <div class="question-hint">${question.hint || 'Listen carefully and give your answer'}</div>
      </div>
    `;

    // Clear feedback
    if (feedbackElement) {
      feedbackElement.innerHTML = '';
      feedbackElement.classList.remove('show-feedback');
    }

    // Reset input
    if (inputElement) {
      inputElement.innerHTML = '';
    }

    // Ask question via voice
    this.askQuestionVoice(question);
  }

  /**
   * Ask question using voice
   */
  async askQuestionVoice(question) {
    try {
      // Speak the question
      await this.voice.askQuestion(question.prompt, {
        character: 'sophie',
        narration: question.narration || question.prompt
      });

      console.log('🎤 Question narrated');

      // Wait a moment, then listen for answer
      setTimeout(() => {
        this.listenForAnswer();
      }, 1000);

    } catch (error) {
      console.error('Failed to ask question:', error);
    }
  }

  /**
   * Listen for student's voice answer
   */
  async listenForAnswer() {
    try {
      const feedbackElement = document.getElementById('feedback-area');

      // Show listening indicator
      if (feedbackElement) {
        feedbackElement.innerHTML = `
          <div class="listening-indicator">
            <div class="pulse-dot"></div>
            <p>🎤 Listening... Speak your answer!</p>
          </div>
        `;
      }

      // Get response
      const response = await this.voice.listenForResponse({ timeout: 15000 });

      // Process answer
      const result = await this.launcher.recordVoiceResponse(this.currentQuestion, {
        transcript: response.text,
        confidence: response.confidence
      });

      console.log('✅ Answer recorded:', result.isCorrect);

      // Handle with auto-progression
      await this.progressionManager.handleResponseWithAutoProgression(
        result,
        feedbackElement
      );

    } catch (error) {
      console.error('❌ Error listening for answer:', error);

      const feedbackElement = document.getElementById('feedback-area');
      if (feedbackElement) {
        feedbackElement.innerHTML = `
          <div class="error-feedback">
            <p>❌ ${error.message}</p>
            <button onclick="location.reload()">Try Again</button>
          </div>
        `;
      }
    }
  }

  /**
   * End activity and show summary
   */
  async endActivity(summary) {
    this.isRunning = false;
    console.log('🏁 Activity ended');
    console.log('Summary:', summary);

    const summaryElement = document.getElementById('summary-area');
    if (summaryElement) {
      summaryElement.innerHTML = `
        <div class="activity-summary">
          <h2>🎉 Activity Complete!</h2>
          <div class="summary-stats">
            <div class="stat">
              <div class="stat-label">Questions Answered</div>
              <div class="stat-value">${summary.questionsAnswered}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Correct Answers</div>
              <div class="stat-value">${summary.correctAnswers}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Accuracy</div>
              <div class="stat-value">${summary.accuracy}%</div>
            </div>
            <div class="stat">
              <div class="stat-label">Total XP</div>
              <div class="stat-value">${summary.totalXP}</div>
            </div>
          </div>
          <button class="btn-primary" onclick="location.reload()">Play Again</button>
          <button class="btn-secondary" onclick="history.back()">Go Back</button>
        </div>
      `;
    }

    // Announce via voice
    const accuracy = summary.accuracy;
    const feedbackText = accuracy >= 80 
      ? `Fantastic! You got ${accuracy}% correct!`
      : `Great job! You earned ${summary.totalXP} points!`;

    await this.voice.speakAsCharacter(feedbackText, 'buddy', 'celebration');
  }

  /**
   * Pause activity
   */
  pause() {
    if (this.progressionManager) {
      this.progressionManager.pauseProgression();
    }
    this.isRunning = false;
    console.log('⏸️ Activity paused');
  }

  /**
   * Resume activity
   */
  resume() {
    if (this.progressionManager) {
      this.progressionManager.resumeProgression();
    }
    this.isRunning = true;
    console.log('▶️ Activity resumed');
  }

  /**
   * Skip current question
   */
  skip() {
    if (this.progressionManager) {
      this.progressionManager.skipQuestion();
    }
  }

  /**
   * Enable/disable auto-progression
   */
  setAutoProgression(enabled, delayMs = 2000) {
    if (this.launcher) {
      this.launcher.setAutoProgression(enabled, delayMs);
      console.log(`🔄 Auto-progression: ${enabled ? 'ENABLED' : 'DISABLED'}`);
    }
  }

  /**
   * Stop the activity
   */
  stop() {
    this.isRunning = false;
    this.voice.stopAll();
    console.log('⏹️ Activity stopped');
  }
}

/**
 * HTML Template for auto-progression activity
 */
export const AutoProgressionActivityTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auto-Progression Activity</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 20px;
        }

        .activity-title {
            font-size: 2em;
            color: #333;
            font-weight: bold;
        }

        .progress-info {
            text-align: right;
            color: #666;
        }

        .question-container {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            border-left: 5px solid #667eea;
        }

        .question-number {
            color: #667eea;
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 0.9em;
        }

        .question-text {
            font-size: 1.8em;
            color: #333;
            font-weight: 600;
            margin-bottom: 15px;
        }

        .question-hint {
            color: #999;
            font-size: 0.95em;
            font-style: italic;
        }

        #feedback-area {
            min-height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 30px;
        }

        .listening-indicator {
            text-align: center;
            color: #667eea;
        }

        .pulse-dot {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #667eea;
            border-radius: 50%;
            animation: pulse 1s infinite;
            margin-right: 10px;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
        }

        .activity-summary {
            text-align: center;
        }

        .summary-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 30px 0;
        }

        .stat {
            background: #f0f0f0;
            padding: 20px;
            border-radius: 10px;
        }

        .stat-label {
            color: #666;
            font-weight: 500;
            margin-bottom: 10px;
        }

        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }

        .btn-primary {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            margin: 10px;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            background: #5568d3;
            transform: translateY(-2px);
        }

        .btn-secondary {
            background: #e0e0e0;
            color: #333;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            margin: 10px;
        }

        .btn-secondary:hover {
            background: #d0d0d0;
        }

        .controls {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            justify-content: center;
        }

        .control-btn {
            padding: 8px 16px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
        }

        .control-btn:hover {
            background: #f0f0f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="activity-title">🎯 Learning Activity</div>
            <div class="progress-info" id="progress-info">Ready to start</div>
        </div>

        <div id="question-text"></div>

        <div id="feedback-area"></div>

        <div id="voice-input"></div>

        <div class="controls">
            <button class="control-btn" onclick="pauseActivity()">⏸️ Pause</button>
            <button class="control-btn" onclick="skipQuestion()">⏭️ Skip</button>
            <button class="control-btn" onclick="toggleAutoProgression()">🔄 Auto-Progress</button>
        </div>

        <div id="summary-area"></div>
    </div>

    <script type="module">
        import { AutoProgressionActivity } from './auto-progression-example.js';
        import { getActivityById } from './index.js';

        let activity = null;

        // Initialize activity when page loads
        window.addEventListener('load', async () => {
            try {
                // Load sample activity
                const sampleActivity = await getActivityById('number-recognition');
                
                if (!sampleActivity) {
                    console.error('Activity not found');
                    return;
                }

                activity = new AutoProgressionActivity(
                    sampleActivity,
                    'student-123'
                );

                await activity.start();
            } catch (error) {
                console.error('Failed to start activity:', error);
            }
        });

        // Global control functions
        window.pauseActivity = () => {
            if (activity) activity.pause();
        };

        window.skipQuestion = () => {
            if (activity) activity.skip();
        };

        window.toggleAutoProgression = () => {
            if (activity) {
                const newState = !activity.launcher.autoProgressEnabled;
                activity.setAutoProgression(newState);
            }
        };
    </script>
</body>
</html>
`;
