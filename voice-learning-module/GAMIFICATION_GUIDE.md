# Gamification System - Quick Start Guide

## Overview

The gamification system includes:
- **XP & Leveling** - Award experience points, automatic level progression
- **Badges** - Achievements unlocked by milestones (3-day streak, 90% accuracy, etc.)
- **Progress Tracking** - Accuracy, attempts, streaks, response times
- **Leaderboard** - Local & optional backend rankings

All data is stored in **browser localStorage** by default, with optional sync to backend.

## Running the Gamification Demo

### Option 1: Node.js (Recommended for Testing)

```bash
# From the project root
cd src/gamification

# Make sure Node.js is installed
node --version

# Run the demo (requires ES modules support)
node --input-type=module --eval "import('./demo.js').then(() => {}).catch(e => console.error(e))"
```

Or create a simple runner:

```bash
# Create run.js in src/gamification/
cat > run.js << 'EOF'
import GamificationEngine from './gamification-engine.js';
import Badges from './badges.js';
import ProgressTracker from './progress-tracker.js';
import Leaderboard from './leaderboard.js';

const gamification = new GamificationEngine({ autoSave: true });
const studentId = 'student_alice';
gamification.ensurePlayer(studentId);
gamification.rewardForActivity(studentId, { correct: true, timeTaken: 3.5, difficulty: 0.7 });
console.log('Player:', gamification.getPlayer(studentId));
EOF

node run.js
```

### Option 2: Browser Console (Interactive Testing)

1. Open your HTML file in a browser:
```html
<!DOCTYPE html>
<html>
<head><title>Gamification Test</title></head>
<body>
  <h1>Gamification System Test</h1>
  <div id="output"></div>
  
  <script type="module">
    import GamificationEngine from './gamification-engine.js';
    
    window.gamification = new GamificationEngine({ autoSave: true });
    
    // Now use in console:
    // gamification.ensurePlayer('alice')
    // gamification.rewardForActivity('alice', { correct: true, timeTaken: 3, difficulty: 0.5 })
    // gamification.getPlayer('alice')
    
    console.log('Gamification loaded! Try:', 'gamification.rewardForActivity("alice", {correct: true, timeTaken: 3, difficulty: 0.5})');
  </script>
</body>
</html>
```

2. Then in browser DevTools console:
```javascript
gamification.ensurePlayer('alice');
gamification.rewardForActivity('alice', { correct: true, timeTaken: 3.5, difficulty: 0.7 });
gamification.getPlayer('alice');
gamification.getLeaderboard(5);
```

### Option 3: Integrate with Voice Learning Module

Add to `src/core/voice-learning-module.js`:

```javascript
import GamificationEngine from '../gamification/gamification-engine.js';

class VoiceLearningModule {
  constructor(config = {}) {
    // ... existing code ...
    
    // Initialize gamification
    this.gamification = new GamificationEngine({
      backendUrl: config.backendUrl,
      syncEnabled: config.gamificationSync || false,
      autoSave: true
    });
  }
  
  async handleResponse(userResponse, audioBuffer) {
    // ... existing validation logic ...
    
    // After validating answer, reward XP
    const activityResult = {
      correct: isCorrect,
      timeTaken: responseTime,
      difficulty: this.currentQuestion.difficulty
    };
    
    const reward = this.gamification.rewardForActivity(
      this.currentStudent.id,
      activityResult
    );
    
    console.log('XP Awarded:', reward);
    
    if (reward.leveledUp.leveled) {
      await this.voiceSynthesizer.speak(
        `Congratulations! You reached level ${reward.leveledUp.to}!`
      );
    }
    
    if (reward.newBadges.length > 0) {
      const badgeNames = reward.newBadges.map(b => b.name).join(', ');
      await this.voiceSynthesizer.speak(`You earned: ${badgeNames}`);
    }
  }
}
```

## Usage Examples

### Award XP

```javascript
const gamification = new GamificationEngine();

// Option 1: Direct XP award
gamification.awardXP('student_1', 25, 'activity_complete');

// Option 2: Automatic XP based on activity
gamification.rewardForActivity('student_1', {
  correct: true,
  timeTaken: 4.2,
  difficulty: 0.6
});
```

### Check Badges

```javascript
// Get all badges for a student
const badges = gamification.getPlayerBadges('student_1');
badges.forEach(badge => {
  console.log(`${badge.icon} ${badge.name}: ${badge.description}`);
});

// Manually grant a badge
gamification.grantBadge('student_1', 'accuracy-90');
```

### Get Leaderboard

```javascript
// Local leaderboard (in-memory only)
const topPlayers = gamification.getLeaderboard(10);
topPlayers.forEach((player, rank) => {
  console.log(`${rank + 1}. ${player.id}: ${player.xp} XP`);
});
```

### Record Attempt & Track Stats

```javascript
const player = gamification.getPlayer('student_1');

// Record multiple attempts
gamification.progress.recordAttempt(player, true, 3.5);
gamification.progress.recordAttempt(player, true, 4.1);
gamification.progress.recordAttempt(player, false, 5.2);

// Check stats
console.log({
  attempts: player.attempts,
  correct: player.correct_count,
  accuracy: (player.correct_count / player.attempts * 100).toFixed(1) + '%',
  streakDays: player.meta.streakDays
});
```

## Available Badges

| Badge | Condition | XP |
|-------|-----------|-----|
| 🌟 Getting Started | First activity completed | 5 |
| 🔥 3-Day Streak | Played 3 consecutive days | 10 |
| 🏆 Accuracy Ace | 90%+ accuracy on activity set | 15 |
| ⚡ Speedy Solver | Answered quickly multiple times | 8 |

Add more in `src/gamification/badges.js` → `_createDefaultBadges()`.

## Data Storage

### localStorage

- Key: `vlm_gamification_state_v1`
- Contains: All players, XP, levels, badges, streaks
- Persists across browser sessions
- ~1-10KB per 10 active students

**View in browser DevTools:**
```javascript
// Console
JSON.parse(localStorage.getItem('vlm_gamification_state_v1'))
```

### Optional Backend Sync

Enable backend sync (requires Python ML backend running):

```javascript
const gamification = new GamificationEngine({
  backendUrl: 'http://localhost:5000/api/gamification',
  syncEnabled: true
});
```

This requires backend endpoints (not yet implemented):
- `POST /api/gamification/player-sync`
- `GET /api/gamification/leaderboard`
- `POST /api/gamification/submit-score`

## Configuration

```javascript
const gamification = new GamificationEngine({
  // Backend URL for sync (optional)
  backendUrl: 'http://localhost:5000/api/gamification',
  
  // Enable automatic sync to backend after XP changes
  syncEnabled: false,
  
  // Auto-save to localStorage
  autoSave: true
});
```

## Next Steps

1. **Add UI Components** - Display badges, level, XP bar, leaderboard
2. **Add Backend Persistence** - Store player data server-side for cross-device sync
3. **More Activities** - Create activities that reward varying XP amounts
4. **Caregiver Dashboard** - Show parent/teacher progress view
5. **Custom Badges** - Add rules for specific learning milestones

## Troubleshooting

**Q: Data not persisting?**
- Check if localStorage is enabled: `localStorage.getItem('test')`
- Clear old data: `localStorage.removeItem('vlm_gamification_state_v1')`

**Q: Badges not awarding?**
- Check player conditions in `badges.js` → `checkAndAward()`
- Ensure `player.meta` exists: `player.meta = player.meta || {}`

**Q: Want to reset?**
```javascript
gamification.resetAll();
// or manually
localStorage.removeItem('vlm_gamification_state_v1');
```

**Q: Sync to backend failing?**
- Ensure backend is running: `http://localhost:5000/health`
- Add backend endpoints to `ml-backend/src/api/routes.py`
- Check browser console for CORS errors

## Example: Full Integration

See `demo.js` for a complete working example showing:
- Player creation
- XP awarding
- Badge checking
- Attempt recording
- Leaderboard building
- localStorage persistence

---

**Status**: ✅ Gamification system ready for integration with activities and UI components.
