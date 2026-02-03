# Quick Test Guide - Activity Launcher

## System Status Check
1. **Backend Running?** → http://localhost:5000/health
   - Should show: `"status": "operational"`

2. **Frontend Running?** → http://localhost:3000
   - Should show: Gamification dashboard

## Test Activity Start (3 ways)

### Way 1: Dashboard Direct (Recommended)
1. Open http://localhost:3000/gamification
2. Dashboard loads with student data
3. Click any activity card (🔢 🎯 ➕ 🔤)
4. Activity interface should display
5. Open browser console (F12) to see logs:
   ```
   🎮 Starting activity: number-recognition for student: [id]
   📚 Initializing activity...
   🚀 Starting session for student [id] in activity number-recognition
   📤 Session creation payload: {...}
   📥 Session response status: 201
   ✅ Activity session started: [session-id]
   ```

### Way 2: Diagnostic Test Page
1. Open http://localhost:3000/test-activity-launcher.html
2. Click buttons in order:
   - "Test Backend Health" → Should show ✅
   - "Test Activity Import" → Should show activity name
   - "Test Session Creation" → Should show session ID
   - "Test Full Activity Flow" → End-to-end test
3. All should show green (success)

### Way 3: Browser Console Direct
1. Open http://localhost:3000/gamification
2. Press F12 to open developer tools
3. Go to Console tab
4. Paste and run:
```javascript
const { initializeActivity } = await import('./src/activities/activity-launcher.js');
const launcher = await initializeActivity('number-recognition', 'test-student-123');
console.log('✅ Success! Session:', launcher.sessionId);
```

## What Should Happen

### Activity Start Sequence
```
1. Load activity definition ✅
2. Create database session ✅
3. Show question interface ✅
4. Wait for student response ✅
5. Record response to database ✅
6. Calculate XP earned ✅
7. Update difficulty level ✅
8. Award badges if earned ✅
9. Update leaderboard ✅
```

## Troubleshooting

### Error: "Failed to start activity"
- [ ] Check F12 console for JavaScript errors
- [ ] Verify BACKEND_URL is correct (line 12 of activity-launcher.js)
- [ ] Test backend: http://localhost:5000/health
- [ ] Clear browser cache: Ctrl+Shift+Delete

### Error: "Activity not found"
- [ ] Verify activity ID spelling (number-recognition, basic-math, etc)
- [ ] Check src/activities/index.js for activity registry
- [ ] Verify activity files exist

### Error: "Failed to start session"
- [ ] Check Flask terminal for errors
- [ ] Verify student_id is not empty
- [ ] Test API directly: http://localhost:5000/api/db/sessions (POST)

### No XP earned
- [ ] Check backend logs for response recording errors
- [ ] Verify response payload has correct field names
- [ ] Test endpoint: http://localhost:5000/api/db/responses (POST)

## Console Log Meanings

| Log | Meaning |
|-----|---------|
| 🚀 Starting session | Session creation initiated |
| 📤 Session creation payload | Request being sent to backend |
| 📥 Session response status | Backend response code (201 = success) |
| ✅ Session started | Session created in database |
| 📚 Loaded activity | Activity definition loaded |
| ✅ Launcher initialized | Ready to start activity |
| 🎮 Starting activity | User clicked activity card |

## Expected Browser Console Output (Success)

```
🎮 Starting activity: number-recognition for student: [UUID]
📚 Initializing activity...
🚀 Starting session for student [UUID] in activity number-recognition
📤 Session creation payload: {
  student_id: "[UUID]"
  activity_id: "number-recognition"
}
📥 Session response status: 201
✅ Session started: [UUID]
📚 Loaded activity: Number Recognition Quest
✅ Launcher initialized with session: [UUID]
✅ Activity session started: [UUID]
```

## Database Tables Being Used

1. **students** - Student profiles and metadata
2. **sessions** - Learning session records
3. **responses** - Individual response records
4. **progress** - Difficulty/IRT level tracking
5. **badges** - Badge award records
6. **analytics** - Session analytics

## Performance Expectations

| Operation | Time | Notes |
|-----------|------|-------|
| Activity load | < 100ms | File-based, no network |
| Session creation | 50-200ms | Database write |
| Response recording | 50-200ms | Database write |
| Full activity start | < 500ms | All operations combined |

## Files Modified for Fix

- `src/activities/activity-launcher.js` - Core launcher logic
- `gamification.html` - Dashboard integration
- Created `ACTIVITY_LAUNCHER_FIX.md` - This fix documentation
- Created `test-activity-launcher.html` - Diagnostic page

## Quick Reference: API Endpoints

```bash
# Create session
POST /api/db/sessions
{ "student_id": "...", "activity_id": "number-recognition" }

# Record response  
POST /api/db/responses
{ "session_id": "...", "student_id": "...", "question_id": "...", 
  "response_text": "one", "correct": true, "confidence": 1.0 }

# Award badge
POST /api/db/badges
{ "student_id": "...", "badge_id": "...", "activity_id": "..." }
```

## Testing Checklist

- [ ] Backend health check passes
- [ ] Test page shows all ✅ 
- [ ] Activity loads without error
- [ ] Session ID appears in console
- [ ] Can answer questions
- [ ] XP counter increases
- [ ] Leaderboard updates
- [ ] Badges awarded
