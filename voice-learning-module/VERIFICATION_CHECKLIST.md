# Quick Verification Checklist

## System Status Check

### Backend (Flask)
Command to verify running:
```powershell
E:\RP-2025\voice-learning-module\ml-backend\venv\Scripts\python.exe E:\RP-2025\voice-learning-module\ml-backend\app.py
```

Expected output:
```
✓ API routes registered
✓ IRT model initialized
✓ Intent recognizer initialized
⚠ Audio processor disabled (librosa not available)
⚠ Emotion classifier disabled (sklearn not available)
Running on http://127.0.0.1:5000
```

### Frontend (Express)
Command to verify running:
```powershell
cd e:\RP-2025\voice-learning-module
npm start
```

Expected: Running on http://localhost:3000

---

## Voice Output Verification

### Test 1: Activity Launch
1. Open http://localhost:3000
2. Click "Start Activity"
3. Select "Number Recognition Quest"
4. **LISTEN**: You should hear character greeting within 3 seconds

✅ **PASS**: "Welcome to Number Recognition Quest! I am max. Let us start learning!"
❌ **FAIL**: No voice or just silence

### Test 2: Question Narration
After hearing greeting:
1. **LISTEN**: Question should narrate automatically after greeting

✅ **PASS**: "What number is this? Three"
❌ **FAIL**: Question not heard

### Test 3: Listening Prompt
After question:
1. **LISTEN**: Prompt to speak should play

✅ **PASS**: "Go ahead, I'm listening!"
❌ **FAIL**: No prompt heard

### Test 4: Voice Input
1. Click "🎤 SPEAK YOUR ANSWER" button
2. Speak clearly: "three" or "3"
3. Watch for transcript display

✅ **PASS**: Transcript shows "You said: three (Confidence: 85%)"
❌ **FAIL**: No transcript or wrong words

### Test 5: Feedback Announcement
After speaking:
1. **LISTEN**: System should announce if correct/incorrect

✅ **PASS**: "Correct! Great job!"
❌ **FAIL**: No feedback voice

### Test 6: XP Announcement
Immediately after feedback:
1. **LISTEN**: XP earned should be announced

✅ **PASS**: "You earned 50 XP!"
❌ **FAIL**: No XP announcement

### Test 7: Next Question
1. **LISTEN**: System should transition to next question

✅ **PASS**: "Ready for the next question?" then question narrates
❌ **FAIL**: No transition prompt

---

## Troubleshooting

### No Voice Heard
- [ ] Check browser volume
- [ ] Check system volume
- [ ] Ensure microphone is working (test with voice recording first)
- [ ] Use Chrome, Safari, or Edge (Firefox doesn't support Web Speech API)
- [ ] Check browser console for errors (F12)

### Activities Don't Start
- [ ] Verify Flask backend is running (`http://localhost:5000/health` should return 200)
- [ ] Check browser console (F12) for JavaScript errors
- [ ] Clear browser cache and reload
- [ ] Check that both services are running

### Questions Not Narrated
- [ ] Audio might be synthesizing on first use (takes 2-3 seconds)
- [ ] Check speechSynthesis availability: Open console and type `speechSynthesis` (should show object)
- [ ] Try a different browser

### Voice Input Not Recording
- [ ] Allow microphone permission in browser
- [ ] Check microphone is working in system settings
- [ ] Test at: https://www.webspeechapi.org/ to verify browser support
- [ ] Try Chrome or Edge (better support than Safari)

---

## Complete Test Session (5 minutes)

1. **Open System**
   - [ ] Backend running: http://localhost:5000/health (returns 200)
   - [ ] Frontend running: http://localhost:3000 (loads page)

2. **Start Activity**
   - [ ] Click "Start Activity"
   - [ ] Select "Number Recognition Quest"
   - [ ] LISTEN for greeting (3 seconds)

3. **Experience Full Flow**
   - [ ] LISTEN: Question narrated
   - [ ] LISTEN: Listening prompt
   - [ ] SPEAK: Say "three"
   - [ ] LISTEN: Correctness feedback
   - [ ] LISTEN: XP announcement
   - [ ] LISTEN: Next question prompt
   - [ ] Repeat for 2-3 questions

4. **End Session**
   - [ ] View final summary
   - [ ] Check dashboard updates with new XP

**If all 4 sections pass**: ✅ System is working correctly

---

## What to Report if Issues

If something isn't working, check:

1. **Browser Console** (F12)
   - Are there JavaScript errors?
   - Copy any error messages

2. **Network Tab** (F12)
   - Are API calls to `:5000` succeeding (200 status)?
   - Or failing (4xx, 5xx status)?

3. **System Details**
   - What browser (Chrome, Safari, Edge, Firefox)?
   - What OS (Windows, Mac, Linux)?
   - What URL are you using?

4. **Reproduction Steps**
   - What did you click?
   - What did you expect to happen?
   - What happened instead?

---

## Quick Commands Reference

```powershell
# Start Backend
E:\RP-2025\voice-learning-module\ml-backend\venv\Scripts\python.exe E:\RP-2025\voice-learning-module\ml-backend\app.py

# Start Frontend (in separate terminal)
cd e:\RP-2025\voice-learning-module
npm start

# Test Backend Health
curl http://localhost:5000/health

# Clear Browser Cache
# Chrome: Ctrl+Shift+Delete
# Safari: Develop > Clear Caches
# Edge: Ctrl+Shift+Delete

# Open Developer Tools
# F12 in Chrome, Edge, Safari, Firefox
```

---

**Last Updated**: December 3, 2025
**System Version**: 4.0
**Voice Status**: ✅ Working
