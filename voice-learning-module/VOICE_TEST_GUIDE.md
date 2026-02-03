# Voice Input Quick Test Guide

## Prerequisites
- ✅ Both servers running (backend on :5000, frontend on :3000)
- ✅ Browser with voice support (Chrome, Edge, Safari)
- ✅ Microphone enabled and working
- ✅ System volume at decent level

## Test 1: Voice Input Basic Test (5 minutes)

### Steps
1. **Open Dashboard**
   - Go to http://localhost:3000/gamification
   - Student data should load

2. **Start Activity**
   - Click "Number Recognition" (🎯)
   - Activity should load with character (🤖 Max)
   - Question narrated: "How many stars do you see?"

3. **Test Microphone**
   - Click **🎤 Click & Speak Your Answer** button
   - Button turns red: "🎤 Listening... Speak your answer!"
   - You should hear "listening" sound (if system has sound)

4. **Speak Answer**
   - Say clearly: "one"
   - Watch transcript appear as you speak:
     - 📝 Interim: "o"
     - 📝 Interim: "on"
     - ✅ Final: "one"

5. **Get Feedback**
   - Transcript shows: "You said: 'one'"
   - Text-to-speech plays: "Excellent! You got it right!"
   - Shows: "✅ +10 XP" and "Confidence: 95%"

6. **Next Question**
   - Auto-reloads to next question
   - New question displays

### Expected Result
✅ Voice recognized correctly
✅ Answer validated
✅ XP awarded
✅ Feedback played
✅ Progress advanced

---

## Test 2: Multiple Answers (5 minutes)

### Test Correct Variations
- Question: "How many circles are here?" (Answer: two)
- Try saying:
  - "two" ✅ Exact match
  - "two circles" ✅ Partial match
  - "Two" ✅ Case insensitive
  - "2" ✅ Number variation

### Test Incorrect Answer
- Question: "How many squares?" (Answer: three)
- Say: "five"
- Should show:
  - ❌ "That is not right. The answer is three."
  - 0 XP awarded
  - Proceeds to next question

---

## Test 3: Browser Console Verification (3 minutes)

### Check Logs
1. Open Browser DevTools: **F12**
2. Go to **Console** tab
3. Start an activity and speak
4. Should see detailed logs:

```
🎮 Starting activity: number-recognition
📚 Initializing activity...
🚀 Starting session for student [UUID]
✅ Session started: [UUID]
🎤 Listening...
📝 Interim: "on"
✅ Final: "one" (confidence: 95%)
🎤 Stopped listening
🎤 Voice response: "one" (confidence: 95%)
✅ Session started: [UUID]
🔊 Speaking: "Excellent! You got it right!"
```

---

## Test 4: All Activities (10 minutes)

### Number Recognition (🎯)
```
Activity: Max the Robot
Questions: 1-10 with pictures
Expected Answers: "one", "two", "three", etc.
Test: Say numbers 1-10
```

### Basic Math (➕)
```
Activity: Professor Wise Owl
Questions: Addition + Subtraction
Expected Answers: "5", "3", "10", etc.
Test: Solve math problems by voice
```

### Alphabet Learning (🔤)
```
Activity: Dragon Dan
Questions: Letter identification
Expected Answers: "A", "B", "C", etc.
Test: Name letters A-Z by voice
```

### Counting Adventure (🔢)
```
Activity: Sophie
Questions: Story counting
Expected Answers: Numbers and counts
Test: Count objects in stories
```

---

## Test 5: Voice Feedback Quality (5 minutes)

### Correct Answer Feedback Phrases
Listen for variety:
- "Excellent! You got it right!"
- "Great job! That is correct!"
- "Perfect! Well done!"
- "Yes! You are a star!"
- "Fantastic! You nailed it!"

Each correct answer should use different phrase (random selection).

### Incorrect Answer Feedback
Listen for:
- "Let me help you. The answer is [answer]."
- "Not quite. The answer is [answer]."
- "Oops! That is not right. The answer is [answer]."

---

## Test 6: Timeout Handling (2 minutes)

### 15 Second Timeout Test
1. Start activity
2. Click microphone
3. Wait 15 seconds without speaking
4. System should:
   - Auto-stop listening
   - Show timeout message
   - Return to question
   - NOT crash

---

## Test 7: Confidence Scoring (3 minutes)

### High Confidence (90%+)
- Clear voice
- Quiet environment
- Standard accent
- Shows: "Confidence: 95%"

### Medium Confidence (50-90%)
- Slight background noise
- Different accent
- Mumbled speech
- Shows: "Confidence: 67%"

### Low Confidence (<50%)
- Noisy environment
- Very quiet voice
- Very unclear speech
- System might not recognize

---

## Test 8: Error Scenarios (5 minutes)

### Scenario 1: No Microphone Permission
**Expected**: 
- Browser asks for permission
- Click "Allow"
- Voice works

### Scenario 2: Microphone Disabled
**Expected**:
- Click button
- No voice recognition
- Error in console: "NotAllowedError"

### Scenario 3: No Speech Detected
**Expected**:
- Click button, say nothing
- Wait 15 seconds
- Auto-stop
- Return to question

### Scenario 4: Incompatible Browser (IE 11)
**Expected**:
- Message: "Voice input not available in your browser"
- No errors
- System still works (graceful degradation)

---

## Test 9: Mobile Testing (Optional - 5 minutes)

### Mobile Voice Input
1. Open http://localhost:3000/gamification on mobile
2. Test on:
   - Chrome Mobile (Android)
   - Safari Mobile (iOS)
   - Edge Mobile

**Expected**:
- Microphone button works
- Voice recognition works
- Touch-friendly interface

---

## Test 10: Concurrent Multiple Students (Optional - 5 minutes)

### Multi-Session Test
1. Open http://localhost:3000/gamification in Browser 1
2. Open http://localhost:3000/gamification in Browser 2 (different student)
3. Start different activities
4. Each should:
   - Have separate sessions
   - Track separate scores
   - Record independent responses
   - Not interfere with each other

---

## Troubleshooting During Tests

### Issue: "Voice not available in browser"
```
Solution:
- Use Chrome, Edge, or Safari
- Check browser supports Web Speech API
- F12 → Console → Check errors
```

### Issue: Microphone not working
```
Solution:
- Check browser microphone permission
- Check system microphone settings
- Test microphone in other app (Teams, Zoom)
- Restart browser
```

### Issue: Speech not recognized
```
Solution:
- Speak louder and clearer
- Reduce background noise
- Check confidence score (< 50% = too quiet)
- Try different word variations
```

### Issue: Text-to-speech not playing
```
Solution:
- Check system volume
- Check browser volume settings
- F12 → Console → Check TTS logs
- Try different browser
```

### Issue: Wrong answer accepted
```
Solution:
- Fuzzy matching is intentional
- Answer: "circle" accepts "a circle" or "circle here"
- For strict matching, edit checkAnswer() in activity-launcher.js
```

### Issue: Page not reloading after response
```
Solution:
- Check browser console for errors
- Check backend is responding
- Try clicking "Exit Activity" and starting again
```

---

## Quick Verification Checklist

- [ ] Microphone works (test in system settings)
- [ ] Browser has voice support (Chrome/Edge/Safari)
- [ ] Backend running (http://localhost:5000/health)
- [ ] Frontend running (http://localhost:3000)
- [ ] Can start activity without errors
- [ ] Microphone button appears (not "Voice not available")
- [ ] Can speak and see transcript
- [ ] Voice feedback plays (or at least logs show it)
- [ ] XP awarded correctly
- [ ] Next question loads
- [ ] All 4 activities work with voice

---

## Performance Expectations

| Action | Time | Status |
|--------|------|--------|
| Activity load | < 1 second | ✅ Fast |
| Question narration | 2-4 seconds | ✅ Automatic |
| Microphone response | < 100ms | ✅ Instant |
| Speech recognition | 500-2000ms | ✅ Real-time |
| Feedback playback | 1-3 seconds | ✅ Automatic |
| Next question load | < 500ms | ✅ Fast |

---

## Success Criteria

All tests pass if:
- ✅ Voice input captures answers correctly
- ✅ Answer validation works (fuzzy matching)
- ✅ XP awarded based on correctness
- ✅ Voice feedback plays automatically
- ✅ Transitions to next question smoothly
- ✅ Handles all 4 activities
- ✅ Console shows detailed logs
- ✅ No JavaScript errors
- ✅ Works on Chrome, Edge, Safari
- ✅ Gracefully degrades if voice unavailable

---

## Sample Test Output (Console)

```
🎮 Starting activity: number-recognition for student: 8f4e...
📚 Initializing activity...
🚀 Starting session for student 8f4e... in activity number-recognition
📤 Session creation payload: {student_id: "8f4e...", activity_id: "number-recognition"}
📥 Session response status: 201
✅ Session started: b2a1...
📚 Loaded activity: Number Recognition Quest
✅ Launcher initialized with session: b2a1...
✅ Activity session started: b2a1...

[User clicks microphone]
🎤 Listening...
📝 Interim: "o"
📝 Interim: "on"
✅ Final: "one" (confidence: 95%)
🎤 Stopped listening

[Recording voice response]
🎤 Voice response: "one" (confidence: 0.95)
🔊 Speaking: "Excellent! You got it right!"
✅ Response recorded: Correct! +10 XP
```

---

Done! All voice input features are working. 🎤✅
