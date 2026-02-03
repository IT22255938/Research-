# Phase 2: Frontend-Backend Integration Guide

## 🎯 Objective

Connect the gamification dashboard and learning activities to the backend database and ML services. This guide outlines the steps to make the system fully functional end-to-end.

---

## 📋 Integration Checklist

### 1. Activity Launch & Session Management
- [ ] Create `activity-launcher.js` module
- [ ] Wire activity cards to backend session API
- [ ] Create session start/end on activity launch
- [ ] Store activity ID in session

### 2. Response Recording
- [ ] Wire voice input to response recording API
- [ ] Send responses to database
- [ ] Calculate accuracy and time
- [ ] Store emotion state (if available)

### 3. Adaptive Difficulty
- [ ] Get current student difficulty from database
- [ ] Calculate accuracy after each response
- [ ] Call IRT model endpoint (Python backend)
- [ ] Update difficulty in real-time

### 4. Reward Processing
- [ ] Calculate XP earned per response
- [ ] Award bonuses (speed, accuracy)
- [ ] Check badge conditions
- [ ] Update student profile in database
- [ ] Update leaderboard rankings

### 5. Real-time UI Updates
- [ ] Display XP earned after each question
- [ ] Show level progress in real-time
- [ ] Update badges on dashboard
- [ ] Refresh leaderboard after activity completion
- [ ] Show achievement notifications

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    GAMIFICATION.HTML                      │
│  (Student Dashboard, Activity Cards, XP/Badge Display)   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│            ACTIVITY MODULE (activity-launcher.js)         │
│  (Loads activity, handles user input, processes responses)│
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────┬────┴────┬──────────┐
        ↓          ↓         ↓          ↓
   ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
   │Database│ │IRT     │ │Emotion │ │Voice     │
   │API     │ │Model   │ │Detector│ │Processor │
   └────────┘ └────────┘ └────────┘ └──────────┘
        │          │         │          │
        └──────────┴────┬────┴──────────┘
                       ↓
        ┌─────────────────────────────┐
        │    PYTHON FLASK BACKEND      │
        │  (Running on :5000)          │
        │  - Database operations       │
        │  - IRT model calculations    │
        │  - Audio processing          │
        │  - Emotion detection         │
        └─────────────────────────────┘
```

---

## 🔌 API Endpoints to Integrate

### Database Endpoints (Already Created)

```javascript
// Session Management
POST /api/db/sessions
  Body: { student_id, activity_id }
  Returns: { session_id, created_at }

POST /api/db/sessions/{session_id}/end
  Body: { duration, total_responses }
  Returns: { session_id, ended_at }

// Response Recording
POST /api/db/responses
  Body: {
    session_id,
    activity_id,
    question_id,
    user_answer,
    is_correct,
    time_taken,
    emotion_state,
    confidence_score
  }
  Returns: { response_id, recorded_at }

// Progress Tracking
GET /api/db/progress/{student_id}/{activity_id}
  Returns: { current_level, accuracy, total_responses }

POST /api/db/progress/{student_id}/{activity_id}
  Body: { current_level, accuracy, total_xp }
  Returns: { updated_progress }

// Badge Operations
POST /api/db/badges
  Body: { student_id, badge_id, activity_id }
  Returns: { badge_id, awarded_at }

GET /api/db/students/{student_id}/stats
  Returns: { total_xp, level, badges, sessions_count, accuracy }
```

---

## 💻 Step 1: Create Activity Launcher Module

**File**: `src/activities/activity-launcher.js`

```javascript
/**
 * Activity Launcher
 * Manages activity lifecycle: start, questions, responses, end
 */

export class ActivityLauncher {
  constructor(activity, studentId, studentLevel) {
    this.activity = activity;
    this.studentId = studentId;
    this.currentLevel = studentLevel || 1;
    this.sessionId = null;
    this.responses = [];
    this.startTime = null;
    this.currentQuestionIndex = 0;
  }

  /**
   * Start activity session
   */
  async startSession() {
    try {
      const response = await fetch('/api/db/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: this.studentId,
          activity_id: this.activity.id
        })
      });

      const data = await response.json();
      this.sessionId = data.session_id;
      this.startTime = new Date();

      console.log(`Session started: ${this.sessionId}`);
      return this.sessionId;
    } catch (error) {
      console.error('Failed to start session:', error);
      throw error;
    }
  }

  /**
   * Get next question based on current level
   */
  getNextQuestion() {
    const levelQuestions = this.activity.questionBank.filter(
      q => q.difficulty === this.currentLevel
    );

    if (this.currentQuestionIndex >= levelQuestions.length) {
      this.currentQuestionIndex = 0;
    }

    return levelQuestions[this.currentQuestionIndex];
  }

  /**
   * Record student response
   */
  async recordResponse(question, userAnswer, timeInSeconds) {
    try {
      // Check if answer is correct
      const isCorrect = this.checkAnswer(question, userAnswer);

      // Send to database
      const response = await fetch('/api/db/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.sessionId,
          activity_id: this.activity.id,
          question_id: question.id,
          user_answer: userAnswer,
          is_correct: isCorrect,
          time_taken: timeInSeconds,
          emotion_state: null // TODO: integrate emotion detector
        })
      });

      const data = await response.json();

      // Store response locally
      this.responses.push({
        questionId: question.id,
        isCorrect,
        timeInSeconds,
        xpEarned: this.calculateXP(isCorrect, timeInSeconds)
      });

      // Update difficulty
      await this.updateDifficulty();

      return { isCorrect, xpEarned: this.responses[this.responses.length - 1].xpEarned };
    } catch (error) {
      console.error('Failed to record response:', error);
      throw error;
    }
  }

  /**
   * Check if answer is correct (fuzzy matching)
   */
  checkAnswer(question, userAnswer) {
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    return question.expectedAnswers.some(expected =>
      expected.toLowerCase().includes(normalizedAnswer) ||
      normalizedAnswer.includes(expected.toLowerCase())
    );
  }

  /**
   * Calculate XP earned
   */
  calculateXP(isCorrect, timeInSeconds) {
    if (!isCorrect) return 0;

    let xp = this.activity.rewards.xpPerCorrectAnswer || 10;

    // Speed bonus
    if (timeInSeconds < 5 && this.activity.rewards.bonusXpForSpeed) {
      xp += this.activity.rewards.bonusXpForSpeed;
    }

    return xp;
  }

  /**
   * Update difficulty based on accuracy
   */
  async updateDifficulty() {
    const accuracy = this.getAccuracy();
    const rules = this.activity.adaptiveRules;

    let newLevel = this.currentLevel;

    if (accuracy >= rules.increaseOn && this.currentLevel < rules.maxDifficulty) {
      newLevel = this.currentLevel + 1;
    } else if (accuracy < rules.decreaseOn && this.currentLevel > rules.minDifficulty) {
      newLevel = this.currentLevel - 1;
    }

    if (newLevel !== this.currentLevel) {
      this.currentLevel = newLevel;

      // Update progress in database
      await fetch(`/api/db/progress/${this.studentId}/${this.activity.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_level: this.currentLevel,
          accuracy: accuracy,
          total_xp: this.getTotalXP()
        })
      });
    }
  }

  /**
   * Get current accuracy percentage
   */
  getAccuracy() {
    if (this.responses.length === 0) return 0;
    const correct = this.responses.filter(r => r.isCorrect).length;
    return correct / this.responses.length;
  }

  /**
   * Get total XP earned in session
   */
  getTotalXP() {
    return this.responses.reduce((sum, r) => sum + r.xpEarned, 0);
  }

  /**
   * End activity session
   */
  async endSession() {
    try {
      const totalXP = this.getTotalXP();
      const accuracy = this.getAccuracy();
      const duration = new Date() - this.startTime;

      // End session in database
      const response = await fetch(`/api/db/sessions/${this.sessionId}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: duration,
          total_responses: this.responses.length
        })
      });

      // Award bonuses
      if (accuracy === 1.0) {
        // 100% accuracy bonus
        const bonusXP = this.activity.rewards.bonusXpForAccuracy || 10;
        console.log(`Bonus: ${bonusXP} XP for perfect accuracy!`);
      }

      return {
        sessionId: this.sessionId,
        totalXP,
        accuracy: Math.round(accuracy * 100),
        responses: this.responses.length
      };
    } catch (error) {
      console.error('Failed to end session:', error);
      throw error;
    }
  }
}
```

---

## 🎮 Step 2: Update Gamification Dashboard

**File**: `gamification.html` (Activity Card Click Handler)

```javascript
// When activity card is clicked
async function startActivity(activityId) {
  try {
    // Load activity
    const activityModule = await import(`./src/activities/${activityId}.js`);
    const activity = activityModule[Object.keys(activityModule)[0]];

    // Get student ID from localStorage
    const studentId = localStorage.getItem('studentId') || 'demo-user';

    // Get student level
    const statsResponse = await fetch(`/api/db/students/${studentId}/stats`);
    const stats = await statsResponse.json();

    // Start activity launcher
    const launcher = new ActivityLauncher(activity, studentId, stats.current_level);
    await launcher.startSession();

    // Show activity modal (or new page)
    displayActivityQuestion(launcher, activity);

  } catch (error) {
    console.error('Failed to start activity:', error);
    alert('Failed to start activity. Check console.');
  }
}

// Display current question
function displayActivityQuestion(launcher, activity) {
  const question = launcher.getNextQuestion();

  // Update UI
  document.getElementById('questionText').textContent = question.narration;
  document.getElementById('questionHint').textContent = question.hint;

  // Set up voice input handler
  setupVoiceInput(async (userAnswer) => {
    const startTime = Date.now();
    const { isCorrect, xpEarned } = await launcher.recordResponse(
      question,
      userAnswer,
      (Date.now() - startTime) / 1000
    );

    // Show feedback
    showFeedback(isCorrect, question, xpEarned);

    // Load next question or end session
    launcher.currentQuestionIndex++;
    if (launcher.currentQuestionIndex >= launcher.activity.questionBank.length) {
      endActivity(launcher);
    } else {
      displayActivityQuestion(launcher, activity);
    }
  });
}

// End activity
async function endActivity(launcher) {
  const result = await launcher.endSession();

  // Show result screen
  showActivityResult(result);

  // Update leaderboard and badges
  await refreshDashboard();
}
```

---

## 📊 Step 3: Real-time Progress Updates

Update the dashboard to show:
- XP earned from current session
- Level progress
- Badge awards
- Leaderboard updates

```javascript
async function refreshDashboard() {
  const studentId = localStorage.getItem('studentId');

  // Get updated stats
  const response = await fetch(`/api/db/students/${studentId}/stats`);
  const stats = response.json();

  // Update XP display
  document.getElementById('totalXP').textContent = stats.total_xp;

  // Update level
  const level = Math.floor(stats.total_xp / 100) + 1;
  document.getElementById('level').textContent = `Level ${level}`;

  // Update badges
  loadStudentData();

  // Update leaderboard
  loadLeaderboard();
}
```

---

## 🗣️ Step 4: Voice Input Integration

```javascript
function setupVoiceInput(onResponse) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.onstart = () => {
    document.getElementById('listeningIndicator').style.display = 'block';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('userAnswer').value = transcript;
    onResponse(transcript);
  };

  recognition.onerror = (event) => {
    console.error('Speech error:', event.error);
    alert('Could not understand. Try again please.');
  };

  recognition.onend = () => {
    document.getElementById('listeningIndicator').style.display = 'none';
  };

  // Start listening
  recognition.start();
}
```

---

## 🎯 Step 5: Badge Award Logic

```javascript
async function checkBadges(studentId, activityId, stats) {
  const badges = [];

  // Counting Adventure badges
  if (activityId === 'counting-adventure') {
    if (stats.sessions_completed >= 1) {
      badges.push('counting-starter');
    }
    if (stats.accuracy >= 0.90) {
      badges.push('counting-accuracy-ace');
    }
  }

  // Basic Math badges
  if (activityId === 'basic-math') {
    if (stats.accuracy >= 0.80) {
      badges.push('math-wizard');
    }
  }

  // Award badges
  for (const badgeId of badges) {
    await fetch('/api/db/badges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        badge_id: badgeId,
        activity_id: activityId
      })
    });
  }

  return badges;
}
```

---

## 🚀 Implementation Priority

### Phase 2.1: Core Integration (Week 1)
1. Create `activity-launcher.js`
2. Update gamification.html with event handlers
3. Wire session management
4. Record responses to database
5. Test with one activity

### Phase 2.2: Adaptive Learning (Week 1-2)
1. Implement difficulty updates
2. Integrate IRT model
3. Test adaptive progression

### Phase 2.3: Rewards & Gamification (Week 2)
1. XP calculation and awards
2. Badge logic
3. Leaderboard updates
4. Real-time UI updates

### Phase 2.4: Voice & Emotion (Week 3)
1. Voice input processing
2. Emotion detection integration
3. Confidence scoring

---

## 📝 Testing Checklist

- [ ] Start activity session
- [ ] Record response correctly
- [ ] Calculate accuracy
- [ ] Update difficulty
- [ ] Award XP
- [ ] Check badge conditions
- [ ] Update leaderboard
- [ ] Voice input works
- [ ] UI updates in real-time
- [ ] Session ends properly

---

## 🎓 Summary

Phase 2 transforms the system from independent components to a fully integrated learning platform:

**Before**: Activities exist, but don't connect to backend
**After**: Complete student learning journey tracked and gamified

The integration connects:
- 📝 Activities ↔ Database (responses)
- 📊 Database ↔ Dashboard (stats)
- 🎮 Dashboard ↔ Activities (difficulty)
- 🏆 Rewards ↔ Database (XP/badges)

This guide provides the architecture and code templates to implement Phase 2.

For questions, refer to:
- `ACTIVITIES_GUIDE.md` - Activity details
- `DATABASE.md` - Database API reference
- `GAMIFICATION_FRONTEND.md` - Dashboard UI

Ready to implement? Start with Step 1: Activity Launcher!
