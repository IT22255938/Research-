# 🌟 Daily Challenges - Development Guide

## Overview

Daily Challenges are special high-reward questions that rotate daily, offering students 50% bonus XP for correct answers. This guide covers the complete implementation, how they work, and how to develop and enhance this feature.

---

## 🎯 Core Concept

**What are Daily Challenges?**
- Special questions selected from activities
- ~20% of questions in any activity
- Different set each day (deterministic, changes at midnight)
- +50% XP bonus for correct answers
- Visual indicator (orange banner)
- Tracked in session summary

**Why?**
- Engagement: Special rewards motivate students
- Variety: Different challenges keep learning fresh
- Incentive: Students want to return daily
- Tracking: Teachers see daily engagement

---

## 🔧 Current Implementation

### 1. Daily Challenge Detection Function

**File**: `gamification.html` (Lines ~945-953)

```javascript
function isDailyChallenge(questionId, questionIndex) {
    // Get today's date as a seed
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    
    // Hash the question ID with the day seed
    let hash = 0;
    const input = questionId + dayOfYear.toString();
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    // Return true for ~20% of questions (hash % 5 === 0)
    return (Math.abs(hash) % 5) === 0;
}
```

**How it works:**
1. Gets today's date
2. Converts to "day of year" (0-365)
3. Combines question ID with day seed
4. Creates hash of the combination
5. Returns true if hash % 5 === 0 (~20%)
6. **Key**: Same question always gets same result for same day
7. **Key**: Different day = different hash = different questions

**Example Flow:**
```
Day 1 (Jan 1):
- Question "q1_1" + "0" → hash % 5 = 1 → NOT daily challenge
- Question "q2_3" + "0" → hash % 5 = 0 → IS daily challenge
- Question "q3_2" + "0" → hash % 5 = 2 → NOT daily challenge

Day 2 (Jan 2):
- Question "q1_1" + "1" → hash % 5 = 3 → NOT daily challenge
- Question "q2_3" + "1" → hash % 5 = 4 → NOT daily challenge
- Question "q3_2" + "1" → hash % 5 = 0 → IS daily challenge
```

### 2. Display in Activity Interface

**File**: `gamification.html` (Lines ~1115-1120)

```javascript
// In showActivityInterface() function
if (isDailyChallenge(currentQuestion.id, launcher.currentQuestionIndex)) {
    dailyChallengeHTML = `
        <div style="
            background: linear-gradient(135deg, #FF8C00, #FFB347);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            text-align: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
        ">
            🌟 Daily Challenge!<br>
            +50% XP Bonus 🎁
        </div>
    `;
}
```

**Visual Result:**
```
┌────────────────────────────┐
│ 🌟 Daily Challenge!        │
│ +50% XP Bonus 🎁          │
└────────────────────────────┘
```

### 3. Bonus XP Application

**File**: `gamification.html` (Lines ~1675-1690)

```javascript
// In processVoiceAnswer() function
if (isCorrect) {
    let xpEarned = 20; // Base XP
    
    // Check if daily challenge
    const isDaily = isDailyChallenge(
        currentQuestion.id, 
        launcher.currentQuestionIndex
    );
    
    if (isDaily) {
        const bonusXp = xpEarned * 0.5; // 50% bonus
        xpEarned += bonusXp;
        
        // Track daily challenge stats
        sessionState.dailyChallengeAttempts++;
        sessionState.dailyChallengeCorrect++;
        sessionState.dailyChallengeXp += bonusXp;
    }
}
```

**XP Calculation:**
```
Normal Question:
- Base XP = 20
- Total = 20

Daily Challenge (Correct):
- Base XP = 20
- Bonus XP = 20 * 0.5 = 10
- Total = 30

Daily Challenge (Incorrect):
- Base XP = 0 (wrong)
- No bonus applied
- Total = 0
```

### 4. Session Summary Display

**File**: `gamification.html` (Lines ~2018-2075)

```javascript
// Daily challenge stats in session summary
const dcStats = `
    Daily Challenges Attempted: ${sessionState.dailyChallengeAttempts}
    Daily Challenges Solved: ${sessionState.dailyChallengeCorrect}
    Bonus XP from Daily Challenges: ${Math.round(sessionState.dailyChallengeXp)}
`;
```

### 5. Session State Tracking

**File**: `gamification.html` (Lines ~854-901)

```javascript
const sessionState = {
    // ... other fields ...
    
    // Daily Challenge Tracking
    dailyChallengeAttempts: 0,    // How many daily challenges seen
    dailyChallengeCorrect: 0,     // How many solved correctly
    dailyChallengeXp: 0           // Bonus XP from daily challenges
};
```

---

## 📊 Data Flow

```
Student Starts Activity
    ↓
For Each Question:
    ├─ Get question
    ├─ Call isDailyChallenge(questionId, index)
    │  └─ Hash question + day seed
    │  └─ Return true if hash % 5 === 0
    │
    ├─ If daily challenge:
    │  ├─ Show orange banner
    │  ├─ dailyChallengeAttempts++
    │  └─ Play special voice message (optional)
    │
    └─ Wait for answer
    
    ↓
    
Student Answers Question
    ├─ Check if correct
    ├─ If daily challenge + correct:
    │  ├─ Apply 50% bonus XP
    │  ├─ dailyChallengeCorrect++
    │  ├─ dailyChallengeXp += bonus
    │  └─ Play success sound
    │
    └─ Record timing and result
    
    ↓
    
Activity Ends
    ├─ Calculate session stats
    ├─ Show session summary with daily challenge data
    └─ Display: "You solved X/Y daily challenges!"
```

---

## 🎨 How to Customize

### 1. Change Daily Challenge Frequency

**Current**: ~20% (1 in 5 questions)

**To Change**:

```javascript
// Edit isDailyChallenge() function
return (Math.abs(hash) % 5) === 0;  // 20% (current)
return (Math.abs(hash) % 4) === 0;  // 25% (1 in 4)
return (Math.abs(hash) % 10) === 0; // 10% (1 in 10)
return (Math.abs(hash) % 3) === 0;  // 33% (1 in 3)
```

**Recommendation**: Keep at 20% to balance challenge and reward.

### 2. Change Bonus XP Amount

**Current**: 50% bonus

**To Change**:

```javascript
// In processVoiceAnswer() function
const bonusXp = xpEarned * 0.5;  // 50% (current)
const bonusXp = xpEarned * 1.0;  // 100% double XP
const bonusXp = xpEarned * 0.75; // 75% bigger bonus
const bonusXp = xpEarned * 0.25; // 25% smaller bonus
```

**Recommendation**: 50% is balanced; higher rewards motivation but dilutes regular XP value.

### 3. Change Visual Design

**Current Orange Banner**:

```javascript
// In showActivityInterface() function
background: linear-gradient(135deg, #FF8C00, #FFB347);  // Orange gradient
```

**To Change**:

```javascript
// Gold gradient
background: linear-gradient(135deg, #FFD700, #FFA500);

// Purple/Pink
background: linear-gradient(135deg, #DA70D6, #FF1493);

// Green (eco theme)
background: linear-gradient(135deg, #32CD32, #00FF00);

// Rainbow
background: linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF);
```

### 4. Change Detection Logic

**Current**: Hash-based, deterministic by day

**Alternative 1: Random but consistent per session**

```javascript
function isDailyChallenge(questionId, questionIndex) {
    // Use question index within activity
    // Same activity always has same daily challenges this session
    return questionIndex % 5 === 0; // Every 5th question
}
```

**Alternative 2: True random (changes per session)**

```javascript
function isDailyChallenge(questionId, questionIndex) {
    // Random, but seeded by question ID
    Math.random() = new Math.seededRandom(parseInt(questionId));
    return Math.random() < 0.2; // 20% chance
}
```

**Alternative 3: Time-based difficulty**

```javascript
function isDailyChallenge(questionId, questionIndex) {
    const hour = new Date().getHours();
    
    // More challenges during homework time (4-8 PM)
    if (hour >= 16 && hour < 20) {
        return Math.abs(hash) % 3 === 0; // 33% during homework
    } else {
        return Math.abs(hash) % 5 === 0; // 20% other times
    }
}
```

---

## 🚀 Enhancement Ideas

### Enhancement 1: Voice Announcement

**Add voice feedback when daily challenge appears:**

```javascript
// In showActivityInterface() function
if (isDailyChallenge(currentQuestion.id, launcher.currentQuestionIndex)) {
    // Show banner (existing code)
    
    // Add voice announcement
    const utterance = new SpeechSynthesisUtterance(
        "This is a Daily Challenge! You can earn fifty percent bonus experience points for a correct answer."
    );
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}
```

**Implementation steps:**
1. Create utterance with special message
2. Set slower rate for clarity
3. Speak before question is read
4. Add to systemMessages for display

### Enhancement 2: Difficulty Boost for Daily Challenges

**Make daily challenges harder:**

```javascript
// In showActivityInterface() function
if (isDailyChallenge(currentQuestion.id, launcher.currentQuestionIndex)) {
    // Force difficulty to hard
    sessionState.currentDifficulty = 3; // Hard
    updateDifficultyDisplay();
}
```

**Or:**

```javascript
// Boost difficulty by 1 level
const boostedDifficulty = Math.min(
    sessionState.currentDifficulty + 1,
    3 // Max difficulty
);
// Use boosted difficulty for question selection
```

### Enhancement 3: Streak Multiplier

**Increase bonus if on a streak:**

```javascript
// In processVoiceAnswer() function
if (isDaily && isCorrect) {
    let xpEarned = 20;
    
    // Base bonus
    let bonusXp = xpEarned * 0.5;
    
    // Streak multiplier
    const streakMultiplier = 1 + (sessionState.consecutiveCorrect * 0.1);
    // 1 streak = 1.1x, 2 streak = 1.2x, 3 streak = 1.3x
    
    bonusXp *= streakMultiplier;
    xpEarned += bonusXp;
}
```

**Result:**
```
Daily Challenge + 0 streak: 20 base + 10 bonus = 30 XP
Daily Challenge + 1 streak: 20 base + 11 bonus = 31 XP
Daily Challenge + 2 streak: 20 base + 12 bonus = 32 XP
Daily Challenge + 3 streak: 20 base + 13 bonus = 33 XP
```

### Enhancement 4: Weekly Cumulative Challenges

**Track daily challenges across the week:**

```javascript
// Add to student profile (localStorage)
const studentProfile = {
    // ... existing fields ...
    
    // Weekly tracking
    weekStartDate: '2026-01-01',
    dailyChallengeWeekly: {
        attempted: 0,
        correct: 0,
        xpBonus: 0
    },
    
    // Weekly bonus at 5 days of challenges
    weeklyBonusAvailable: false,
    weeklyBonusXp: 100
};

// Check for weekly bonus
if (studentProfile.dailyChallengeWeekly.correct >= 5) {
    studentProfile.weeklyBonusAvailable = true;
    studentProfile.weeklyBonusXp = 100;
}
```

### Enhancement 5: Difficulty-Specific Daily Challenges

**Different daily challenges per difficulty level:**

```javascript
function isDailyChallenge(questionId, difficulty, questionIndex) {
    // Seed includes difficulty level
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    
    let hash = 0;
    const input = questionId + dayOfYear + difficulty;
    for (let i = 0; i < input.length; i++) {
        hash = ((hash << 5) - hash) + input.charCodeAt(i);
        hash = hash & hash;
    }
    
    return (Math.abs(hash) % 5) === 0;
}
```

**Result**: Each difficulty level has its own daily challenges.

### Enhancement 6: Special Monthly/Weekly Challenges

**Different challenge types:**

```javascript
function getDailyChallengeType(questionId) {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const weekNumber = Math.floor(dayOfYear / 7);
    
    // Different challenge each week
    const types = ['speed', 'accuracy', 'combo', 'thinking'];
    return types[weekNumber % types.length];
    
    // speed: 30 second timer
    // accuracy: 90% min accuracy
    // combo: Get 3 in a row
    // thinking: Extra time, harder questions
}
```

### Enhancement 7: Leaderboard for Daily Challenges

**Track daily challenge performance:**

```javascript
const dailyChallengeLeaderboard = {
    'student1': {
        date: '2026-01-01',
        attemped: 8,
        correct: 6,
        accuracy: 75,
        xpBonus: 60,
        streak: 3
    },
    'student2': {
        date: '2026-01-01',
        attemped: 5,
        correct: 5,
        accuracy: 100,
        xpBonus: 50,
        streak: 2
    }
};
```

### Enhancement 8: Badge/Achievement for Consistency

**Reward students who do daily challenges consistently:**

```javascript
// Check if student participated in daily challenges last 5 days
function checkConsistencyBadge(studentHistory) {
    let consecutiveDays = 0;
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        if (studentHistory[dateStr]?.dailyChallengeAttempts > 0) {
            consecutiveDays++;
        } else {
            break;
        }
    }
    
    if (consecutiveDays >= 5) {
        return {
            name: 'Daily Warrior',
            description: 'Completed daily challenges 5 days in a row!',
            xp: 100
        };
    }
}
```

---

## 🧪 Testing Daily Challenges

### Test 1: Detection Logic

```javascript
// In browser console, run:
console.log('Testing daily challenge detection...');

// Test same question same day
const result1 = isDailyChallenge('q1_1', 0);
const result2 = isDailyChallenge('q1_1', 1);
console.log('Same question twice:', result1 === result2 ? '✓ Consistent' : '✗ Inconsistent');

// Test different questions
const result3 = isDailyChallenge('q2_1', 0);
console.log('Different questions:', (result1 !== result3) ? '✓ Varied' : '✗ All same');

// Count daily challenges in activity
let dailyCount = 0;
for (let i = 0; i < 20; i++) {
    if (isDailyChallenge(`q${i}_1`, i)) dailyCount++;
}
console.log(`Daily challenges: ${dailyCount}/20 (expected ~4)`);
```

### Test 2: Bonus XP Calculation

```javascript
// Manually test XP calculation
function testXpCalculation() {
    let baseXp = 20;
    let bonusXp = baseXp * 0.5;
    let totalXp = baseXp + bonusXp;
    
    console.log(`Base XP: ${baseXp}`);
    console.log(`Bonus XP (50%): ${bonusXp}`);
    console.log(`Total XP: ${totalXp}`);
    
    return totalXp === 30 ? '✓ Correct' : '✗ Wrong calculation';
}

console.log(testXpCalculation());
```

### Test 3: Session Data

```javascript
// After completing activity with daily challenges
console.log('Session Summary:');
console.log(`Daily Attempts: ${sessionState.dailyChallengeAttempts}`);
console.log(`Daily Correct: ${sessionState.dailyChallengeCorrect}`);
console.log(`Daily XP Bonus: ${sessionState.dailyChallengeXp}`);
console.log(`Expected: ~20% of questions marked as daily`);
```

### Test 4: Different Days

```javascript
// Simulate next day by changing system date
// Note: This requires manipulating system clock or using a seed value

// Or create a test function:
function testNextDay() {
    // Current day results
    const today = isDailyChallenge('q1_1', 0);
    
    // Simulate next day by modifying the function temporarily
    // Results should be different for most questions
    
    console.log('Today:', today);
    // Tomorrow will be different (simulated by incrementing dayOfYear)
}
```

---

## 🔍 Debugging Guide

### Issue 1: Daily Challenges Not Appearing

**Problem**: Banner never shows
**Check**:
```javascript
// Add to showActivityInterface()
console.log('Question ID:', currentQuestion.id);
console.log('Is Daily Challenge:', isDailyChallenge(currentQuestion.id, launcher.currentQuestionIndex));
```

**Solution**: Verify isDailyChallenge() returns true ~20% of the time.

### Issue 2: Bonus XP Not Applied

**Problem**: Daily challenges don't give extra XP
**Check**:
```javascript
// In processVoiceAnswer(), add logging
console.log('Is correct:', isCorrect);
console.log('Is daily challenge:', isDailyChallenge(currentQuestion.id, launcher.currentQuestionIndex));
console.log('XP before bonus:', xpEarned);
console.log('XP after bonus:', xpEarned);
```

**Solution**: Verify condition `if (isDaily && isCorrect)` is true.

### Issue 3: Same Questions Are/Aren't Daily Challenges

**Problem**: Inconsistency in detection
**Check**: The hash function must use:
- Question ID (must be unique per question)
- Day seed (must be same for whole day)

**Solution**: Verify `dayOfYear` calculation is correct.

### Issue 4: Daily Challenges Change During Day

**Problem**: Questions change from daily to non-daily during session
**Check**: The `dayOfYear` calculation must be static per day

**Solution**: Ensure function uses consistent `new Date()`.

---

## 📈 Analytics & Reporting

### Metrics to Track

```javascript
const dailyChallengeMetrics = {
    // Per student
    dailyChallengeAccuracy: sessionState.dailyChallengeCorrect / sessionState.dailyChallengeAttempts,
    totalDailyXpBonus: sessionState.dailyChallengeXp,
    consecutiveDayStreak: calculateStreak(studentHistory),
    
    // Per activity
    activityDailyAttempts: sessionState.dailyChallengeAttempts,
    activityDailySuccess: sessionState.dailyChallengeCorrect,
    
    // School-wide
    totalStudentsParticipating: countStudentsWithDailyAttempts(),
    averageDailyAccuracy: calculateAverageAccuracy(),
    totalBonusXpDistributed: sumAllBonusXp()
};
```

### Report Example

```
Daily Challenge Report - January 1, 2026

School Stats:
- 45 students participated
- 220 daily challenges attempted
- 165 solved correctly (75% accuracy)
- 825 bonus XP distributed

Top Performers:
1. Alex (100% accuracy, 8 challenges)
2. Jordan (88% accuracy, 6 challenges)
3. Sam (83% accuracy, 5 challenges)

Engagement:
- 60% daily participation rate
- Average 4.9 challenges per student
- Peak time: 5-6 PM

Most Challenging Questions:
1. Question #47 (fraction comparison) - 40% accuracy
2. Question #12 (word problem) - 50% accuracy
3. Question #33 (mental math) - 55% accuracy
```

---

## 🎓 Educational Benefits

**For Students:**
- Clear daily goals
- Extra rewards for consistency
- Motivation to return daily
- Sense of special achievement
- Progress tracking

**For Teachers:**
- Identify engagement patterns
- Track consistent learners
- Spot struggling students
- Understand question difficulty
- Personalize instruction

**For School:**
- Increase daily usage
- Build learning habit
- Gamification effectiveness data
- Student engagement metrics
- Retention analysis

---

## 🔐 Production Checklist

Before deploying daily challenges to production:

- [ ] Test hash function produces consistent results
- [ ] Verify ~20% of questions are daily challenges
- [ ] Confirm bonus XP applies correctly
- [ ] Check visual banner displays properly
- [ ] Validate session summary shows daily stats
- [ ] Test with multiple students simultaneously
- [ ] Verify data persists in localStorage
- [ ] Test on mobile/tablet devices
- [ ] Check accessibility (screen readers, colors)
- [ ] Monitor server load during peak times
- [ ] Verify analytics data collection
- [ ] Test edge cases (leap year, time zones)
- [ ] Document for teachers
- [ ] Create student-facing help text
- [ ] Plan for analytics review

---

## 📚 API Reference

### isDailyChallenge(questionId, questionIndex)

**Parameters:**
- `questionId` (string): Unique identifier for question
- `questionIndex` (number): Index in activity

**Returns:**
- `boolean`: true if question is a daily challenge

**Usage:**
```javascript
if (isDailyChallenge('q1_1', 0)) {
    // Show banner
}
```

### Session State Fields

**Related to Daily Challenges:**

```javascript
sessionState.dailyChallengeAttempts  // Count of daily challenges seen
sessionState.dailyChallengeCorrect   // Count solved correctly
sessionState.dailyChallengeXp        // Total bonus XP earned
```

### Daily Challenge Banner HTML

```html
<div style="
    background: linear-gradient(135deg, #FF8C00, #FFB347);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    text-align: center;
    color: white;
    font-weight: bold;
    font-size: 16px;
">
    🌟 Daily Challenge!<br>
    +50% XP Bonus 🎁
</div>
```

---

## 🚀 Next Steps for Development

**Phase 1: Core (Completed)**
- ✅ Hash-based detection
- ✅ Visual banner
- ✅ Bonus XP (50%)
- ✅ Session tracking

**Phase 2: Enhancement (In Planning)**
- [ ] Voice announcements
- [ ] Difficulty boosting
- [ ] Streak multipliers
- [ ] Leaderboards

**Phase 3: Analytics (Future)**
- [ ] Daily reports
- [ ] Performance metrics
- [ ] Teacher dashboards
- [ ] Historical comparison

**Phase 4: Advanced (Long-term)**
- [ ] Weekly mega challenges
- [ ] Seasonal events
- [ ] Themed challenges
- [ ] Competitive modes

---

## 📞 Support & Troubleshooting

**Common Questions:**

**Q: Why do different students see different daily challenges?**
A: Same hash for same day, but if question IDs differ, results differ.

**Q: Can students cheat by changing their device date?**
A: Yes. For production, hash date on server side instead.

**Q: What if we want true daily reset across timezones?**
A: Use UTC date: `new Date().toISOString().split('T')[0]`

**Q: Can we have different challenges per difficulty?**
A: Yes! Include difficulty in hash seed.

**Q: How do we track historical daily challenges?**
A: Store in database with date and student ID.

---

## Summary

**Daily Challenges implementation is:**
- ✅ Deterministic (same questions each day)
- ✅ Lightweight (simple hash function)
- ✅ Scalable (works with any question set)
- ✅ Engaging (special rewards)
- ✅ Trackable (session metrics)
- ✅ Customizable (easy to adjust)

**Ready for:**
- Testing with real students
- Analytics and reporting
- Enhancement with advanced features
- Production deployment
