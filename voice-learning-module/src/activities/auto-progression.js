/**
 * Auto-Progression Manager
 * Automatically moves to next question after correct answer
 * Shows visual feedback before transitioning
 */

export class AutoProgressionManager {
  constructor(activityLauncher) {
    this.launcher = activityLauncher;
    this.isProgressing = false;
    this.progressionTimer = null;
  }

  /**
   * Handle response with auto-progression
   */
  async handleResponseWithAutoProgression(response, feedbackElement) {
    if (!response.isCorrect) {
      console.log('❌ Incorrect answer - not auto-progressing');
      this.showIncorrectFeedback(feedbackElement);
      return;
    }

    // Answer is correct
    console.log('✅ Correct answer - preparing auto-progression');
    this.isProgressing = true;

    // Show correct feedback
    this.showCorrectFeedback(feedbackElement, response.xpEarned);

    // Wait for delay before progressing
    await this.launcher.autoProgressToNextQuestion();

    this.isProgressing = false;
  }

  /**
   * Show correct answer feedback UI
   */
  showCorrectFeedback(element, xpEarned = 0) {
    if (!element) return;

    element.innerHTML = `
      <div class="auto-progression-feedback correct">
        <div class="feedback-animation">
          <span class="check-mark">✅</span>
          <p class="feedback-text">Excellent! Correct!</p>
          ${xpEarned > 0 ? `<p class="xp-earned">+${xpEarned} XP</p>` : ''}
          <div class="progression-bar">
            <div class="progression-fill"></div>
          </div>
          <p class="next-question-text">Next question coming...</p>
        </div>
      </div>
    `;

    element.classList.add('show-feedback');
    this.animateProgressionBar();
  }

  /**
   * Show incorrect answer feedback UI
   */
  showIncorrectFeedback(element) {
    if (!element) return;

    element.innerHTML = `
      <div class="auto-progression-feedback incorrect">
        <div class="feedback-animation">
          <span class="cross-mark">❌</span>
          <p class="feedback-text">Not quite right</p>
          <p class="hint-text">Try again or ask for help!</p>
        </div>
      </div>
    `;

    element.classList.add('show-feedback');
  }

  /**
   * Animate progression bar
   */
  animateProgressionBar() {
    const progressFill = document.querySelector('.progression-fill');
    if (!progressFill) return;

    // Animate to 100% over the auto-progression delay
    const delay = this.launcher.autoProgressDelay || 2000;
    progressFill.style.transition = `width ${delay}ms linear`;
    progressFill.style.width = '100%';
  }

  /**
   * Skip current question and go to next
   */
  skipQuestion() {
    console.log('⏭️ Skipping current question');
    this.launcher.currentQuestionIndex++;
    
    const nextQuestion = this.launcher.getNextQuestion();
    if (this.launcher.onQuestionChanged) {
      this.launcher.onQuestionChanged(nextQuestion);
    }
  }

  /**
   * Pause auto-progression
   */
  pauseProgression() {
    if (this.progressionTimer) {
      clearTimeout(this.progressionTimer);
      this.isProgressing = false;
      console.log('⏸️ Auto-progression paused');
    }
  }

  /**
   * Resume auto-progression
   */
  resumeProgression() {
    if (!this.isProgressing) {
      console.log('▶️ Auto-progression resumed');
      this.launcher.autoProgressToNextQuestion();
    }
  }
}

/**
 * CSS Styles for auto-progression feedback
 */
export const AutoProgressionStyles = `
  /* Auto-progression feedback */
  .auto-progression-feedback {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 90%;
    max-width: 500px;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    animation: slideIn 0.3s ease;
  }

  .auto-progression-feedback.show-feedback {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .auto-progression-feedback.correct {
    background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
    color: white;
  }

  .auto-progression-feedback.incorrect {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    color: white;
  }

  .feedback-animation {
    width: 100%;
  }

  .check-mark {
    display: block;
    font-size: 4em;
    animation: bounceScale 0.6s ease;
  }

  .cross-mark {
    display: block;
    font-size: 4em;
    animation: shake 0.6s ease;
  }

  .feedback-text {
    font-size: 1.8em;
    font-weight: 600;
    margin: 15px 0;
  }

  .xp-earned {
    font-size: 1.5em;
    font-weight: bold;
    animation: slideUp 0.5s ease 0.3s both;
  }

  .hint-text {
    font-size: 1.1em;
    margin-top: 10px;
    opacity: 0.9;
  }

  .progression-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    overflow: hidden;
    margin: 20px 0;
  }

  .progression-fill {
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    width: 0%;
    border-radius: 3px;
  }

  .next-question-text {
    font-size: 0.95em;
    opacity: 0.9;
    animation: pulse 1.5s ease infinite;
  }

  /* Animations */
  @keyframes slideIn {
    from {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  @keyframes bounceScale {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

/**
 * Create and inject auto-progression styles
 */
export function injectAutoProgressionStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = AutoProgressionStyles;
  document.head.appendChild(styleElement);
  console.log('✅ Auto-progression styles injected');
}

/**
 * Setup auto-progression in HTML activity
 */
export function setupAutoProgression(launcher, feedbackElementId = 'feedback-area') {
  // Inject styles
  injectAutoProgressionStyles();

  // Create progression manager
  const progressionManager = new AutoProgressionManager(launcher);

  // Setup launcher callbacks
  launcher.setProgressionCallbacks(
    (nextQuestion) => {
      // Update UI with next question
      console.log('📝 Question changed:', nextQuestion.prompt);
    },
    (summary) => {
      // Activity completed
      console.log('🏁 Activity completed:', summary);
    }
  );

  return progressionManager;
}
