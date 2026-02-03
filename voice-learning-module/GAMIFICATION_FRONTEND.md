# Gamification Dashboard - Quick Start

## 🎮 Access the Dashboard

Open your browser and go to:
```
http://localhost:3000/gamification
```

## 📊 What You'll See

### Student Profile Card
- **Student Avatar & Name** - Personalized learner profile
- **Experience Bar** - Visual progress toward next level
- **Quick Stats** - Sessions completed, accuracy %, total XP

### 🌟 Badges Section
- **Earned Badges** - Achievements unlocked
- **Badge Types**:
  - ⭐ Starter Badge - First step into learning
  - 🔥 3-Day Streak - Learn 3 consecutive days
  - 🏆 Accuracy Ace - Achieve 90% accuracy
  - ⚡ Speedy - Complete activity under 2 minutes

### 🏆 Achievements
- Track progress toward major milestones
- Visual progress bars for each achievement
- Examples:
  - First Steps (1/1)
  - 3-Day Streak (2/3)
  - Perfect Score (0/1)
  - Speed Demon (1/3)

### 🥇 Leaderboard
- Top 3 learners by XP earned
- Ranked by total experience points
- Gold (#1), Silver (#2), Bronze (#3) medals

### 📚 Learning Activities
- **4 Interactive Activities**:
  - 🔢 Counting Adventure
  - 🎯 Number Recognition
  - ➕ Basic Math
  - 🔤 Alphabet Learning
- Click any to launch activity
- XP rewards based on performance

## 🔧 Integration

### Backend Connection
The dashboard connects to your Flask backend at `http://localhost:5000`:

**Student API**:
```javascript
// Fetch student stats
GET /api/db/students/<student_id>/stats
```

**Badges API**:
```javascript
// Get earned badges
GET /api/db/badges/<student_id>
```

**Progress API**:
```javascript
// Get/update progress
GET /api/db/progress/<student_id>/<activity_id>
POST /api/db/progress
```

### Local Storage
- Student ID stored locally (persists across sessions)
- XP and level calculated client-side
- Data syncs with backend database

## 🎯 Gamification Mechanics

### XP System
- **Starting XP**: 0
- **XP per Correct Answer**: 10 XP
- **XP Multipliers**:
  - Streak Bonus: +1.5x after 3 correct
  - Speed Bonus: +1.25x if answered < 5 seconds
  - Accuracy Bonus: +1.1x if accuracy > 80%

### Levels
```
Level = floor(Total XP / 100) + 1

Examples:
- 0-99 XP = Level 1
- 100-199 XP = Level 2
- 200-299 XP = Level 3
```

### Badges (Auto-awarded)
| Badge | Condition |
|-------|-----------|
| Starter | Complete first activity |
| 3-Day Streak | 3 consecutive days |
| Accuracy Ace | 90%+ accuracy |
| Speedy | Activity < 2 min |

## 📱 Responsive Design
- Desktop: Full 3-column grid
- Tablet: 2-column layout
- Mobile: Single column, optimized for small screens

## 🔄 Data Flow

```
User Completes Activity
    ↓
Frontend records response
    ↓
Updates local progress
    ↓
Sends to Backend API: /api/db/responses
    ↓
Backend calculates XP & updates progress
    ↓
Dashboard refreshes automatically
    ↓
New badges awarded if unlocked
    ↓
Leaderboard position updates
```

## 🚀 Features

✅ Real-time progress tracking
✅ Visual XP bar with percentage
✅ Badge collection system
✅ Achievement progress tracking
✅ Leaderboard rankings
✅ Activity launcher
✅ Responsive design
✅ Local storage persistence
✅ Backend database sync
✅ Touch/click friendly

## 🎨 Customization

### Colors
Edit CSS variables:
```css
Primary Color: #667eea (purple)
Secondary Color: #764ba2 (darker purple)
Success: #4caf50 (green)
Warning: #ffc107 (gold)
```

### Badges
Add new badges in `gamification.html`:
```javascript
const badgeIcons = {
    'your_badge': '🎖️',
    'new_achievement': '🏅'
};
```

### Activities
Add new learning activities in activity grid:
```html
<div class="activity-card" onclick="startActivity('your-activity')">
    <div class="activity-icon">🎯</div>
    <div class="activity-name">Your Activity</div>
</div>
```

## 📊 Analytics Available

The dashboard tracks:
- Total sessions played
- Overall accuracy percentage
- Total XP earned
- Current level
- Badges earned
- Achievement progress
- Learning streaks
- Response times

## 🔒 Privacy & Data

- Student data stored locally in browser (localStorage)
- Server database backups recommended
- Export student data: `GET /api/db/students/<id>/export`
- All data can be deleted at any time

## 🐛 Troubleshooting

**Dashboard shows "Loading..."**
- Check backend is running: `http://localhost:5000/health`
- Check browser console for errors (F12)

**Badges not showing**
- Database may not have awarded badges yet
- Complete activities to earn badges automatically

**XP not updating**
- Hard refresh browser: Ctrl+Shift+R (Windows)
- Clear browser cache and reload

**Leaderboard empty**
- Sample data loaded from database
- Complete activities to populate leaderboard

## 📞 Support

For issues:
1. Check backend is running
2. Verify CORS is enabled
3. Check browser console for errors
4. Review database entries: `/api/db/health`
