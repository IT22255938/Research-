# Voice Output Testing Guide

## Complete Voice Testing - Input & Output Combined

This guide walks through testing the complete voice learning system with both speech recognition input and text-to-speech output.

---

## System Readiness Checklist

Before starting tests, verify:
- [ ] Both Flask backend (:5000) and Express frontend (:3000) running
- [ ] Browser volume is ON (speaker/headphone)
- [ ] Microphone is connected and working
- [ ] Browser is Chrome, Edge, or Safari (Web Speech API support)
- [ ] No other applications using microphone
- [ ] Network connectivity confirmed

**Start Services Command**:
```powershell
# Terminal 1: Flask Backend
cd e:\RP-2025\voice-learning-module\ml-backend
.\.venv\Scripts\activate
python app.py

# Terminal 2: Express Frontend  
cd e:\RP-2025\voice-learning-module
npm start
```

---

## Test 1: Voice Output - Character Greeting

**Objective**: Verify character greeting plays when activity starts

### Steps:
1. Open http://localhost:3000 in browser
2. Click "Start Activity" button
3. Select any learning activity (e.g., "Number Recognition")
4. **LISTEN**: You should hear character greeting immediately

### Expected Audio Output:
```
Character Voice: "Hi! I'm Max. Let's learn numbers!"
                 (OR similar greeting depending on activity)
```

### Success Criteria:
- ✅ Audio plays immediately after UI appears
- ✅ Voice is clear and audible
- ✅ Character name matches selected activity
- ✅ Greeting is encouraging and friendly

### Troubleshooting:
```
❌ No audio heard
  → Check browser volume settings
  → Check system volume
  → Open browser console (F12) for errors
  → Verify Web Audio API available: type "speechSynthesis" in console

❌ Audio distorted or slow
  → Browser may be synthesizing audio (first time)
  → Wait 2 seconds for audio synthesis
  → Try different browser if issue persists
```

---

## Test 2: Voice Output - Question Narration

**Objective**: Verify questions are read aloud automatically

### Steps:
1. Complete Test 1 (hear greeting)
2. **LISTEN**: Wait 1-2 seconds after greeting
3. You should hear the question read aloud

### Expected Audio Output:
```
Question Voice: "Count from one to five"
                (or other question text)
```

### Success Criteria:
- ✅ Question narration starts automatically
- ✅ All words are spoken clearly
- ✅ Pace is comfortable (not too fast)
- ✅ Narration completes before user needs to answer

### Troubleshooting:
```
❌ Question not narrated
  → Refresh page and try again
  → Check browser console for JavaScript errors
  → Verify voiceManager.speakQuestion() is called

❌ Narration too fast/slow
  → This is browser-dependent
  → Test in different browser if critical
  → Currently set to rate: 0.8-1.0x speed
```

---

## Test 3: Voice Output - Listening Prompt

**Objective**: Verify system prompts user to speak

### Steps:
1. Complete Test 2 (hear question)
2. **LISTEN**: Wait 2 seconds after question ends
3. You should hear prompt to speak

### Expected Audio Output:
```
Prompt Voice: "Go ahead, I'm listening!"
              (or "Your turn to answer!")
```

### Success Criteria:
- ✅ Prompt plays clearly
- ✅ Prompt timing is appropriate
- ✅ User knows when to start speaking

### Troubleshooting:
```
❌ Prompt not heard
  → May be concurrent with question narration
  → Check console logs: "Speaking listening prompt..."
  → Next test may still proceed

❌ Prompt overlaps with question
  → Timing is adjusted with setTimeout
  → Should resolve by next run
  → Check console for any JavaScript errors
```

---

## Test 4: Voice Input + Recording

**Objective**: Verify microphone captures speech

### Steps:
1. Complete Test 3 (hear listening prompt)
2. Click the "🎤 SPEAK YOUR ANSWER" button
3. **SPEAK**: Say the answer (e.g., "1, 2, 3, 4, 5" for counting)
4. Watch the UI for transcript display

### Expected Display:
```
Status: "✅ Got: '1, 2, 3, 4, 5'"
Transcript: "You said: '1, 2, 3, 4, 5'
            Confidence: 92%"
```

### Success Criteria:
- ✅ Button shows listening state (color change)
- ✅ Transcript displays what system heard
- ✅ Confidence score is reasonable (60%+ for clear speech)
- ✅ No crash or error

### Troubleshooting:
```
❌ No transcript shown
  → Microphone not permitted - allow microphone access
  → Microphone not working - test in system settings
  → Browser doesn't support Web Speech API
  → Check console: navigator.mediaDevices.getUserMedia errors

❌ Very low confidence (<40%)
  → Speak more clearly and slowly
  → Reduce background noise
  → Move closer to microphone
  → System will still process but may be marked incorrect

❌ Completely wrong transcript
  → This is speech recognition accuracy limitation
  → Depends on speaker age/accent/background noise
  → More typical for children or non-native speakers
  → System may show "incorrect" but tries to understand intent
```

---

## Test 5: Voice Output - Correctness Feedback

**Objective**: Verify system announces if answer is correct

### Steps:
1. Complete Test 4 (speak answer)
2. **LISTEN**: Wait 2-3 seconds for feedback

### Expected Audio Output:
```
✅ Correct Answer:
   "Correct! You earned 50 XP! Great job!"

❌ Incorrect Answer:
   "Not quite. The answer is 1, 2, 3, 4, 5. Let's try again!"
```

### Success Criteria:
- ✅ Feedback plays immediately after transcription
- ✅ Feedback tells if answer correct/incorrect
- ✅ Encouraging tone
- ✅ Clear enunciation

### Troubleshooting:
```
❌ Wrong feedback given
  → Transcription was incorrect (see Test 4)
  → System matched incorrectly to expected answers
  → This is expected for speech recognition limitations
  → Later can be improved with ML confidence scoring

❌ No feedback heard
  → Browser audio context may have stalled
  → Refresh page and try again
  → Check console for speakCorrect() or speakIncorrect() calls
```

---

## Test 6: Voice Output - XP Announcement

**Objective**: Verify XP earned announcement

### Steps:
1. Complete Test 5 (hear correctness feedback)
2. **LISTEN**: Immediately after "Great job!" message
3. You should hear XP announcement

### Expected Audio Output:
```
XP Voice: "You earned 50 experience points!"
          (or similar variation)
```

### Success Criteria:
- ✅ XP amount announced matches display
- ✅ Announcement is celebratory in tone
- ✅ Clear volume and speed

### Troubleshooting:
```
❌ XP amount mismatch
  → Check console: announceXPEarned() parameter
  → May be off-by-one error in calculation
  → Check activity difficulty level

❌ No announcement
  → May be rapid transitions between audio
  → Check speakXPEarned() method call
  → Verify xpAmount is positive number
```

---

## Test 7: Voice Output - Next Question Transition

**Objective**: Verify system prompts for next question

### Steps:
1. Complete Test 6 (hear XP announcement)
2. **LISTEN**: After 3-second delay
3. You should hear transition prompt

### Expected Audio Output:
```
Transition: "Ready for the next question?"
            (or "Let's move on!")
```

### Success Criteria:
- ✅ Transition prompt is clear
- ✅ Prompt plays before question
- ✅ Natural pacing between questions

### Troubleshooting:
```
❌ No transition message
  → Demo may have 3-question limit
  → Check if session ending instead
  → Verify announceNextQuestion() called

❌ Transition too quick/slow
  → Adjust setTimeout delays in startVoiceInput()
  → Current: 3000ms before next question prompt
  → Can be modified in gamification.html line ~870
```

---

## Test 8: Complete Session Flow (All 3 Questions)

**Objective**: Verify complete activity session with all voice features

### Steps:
1. Start activity as in Test 1
2. Answer 3 questions following Tests 4-7
3. Wait for session end

### Expected Sequence:
```
1. Greeting     → "Hi! I'm Max. Let's count together!"
2. Q1 Narration → "Count from one to five"
3. Q1 Listening → "Go ahead, I'm listening!"
4. [User speaks answer]
5. Q1 Feedback  → "Correct! You earned 50 XP!"
6. Transition   → "Ready for the next question?"
7. Q2 Narration → [Next question narrated]
8. [Repeat steps 3-7 for questions 2 and 3]
9. Session End  → "Activity complete! You earned 150 XP!"
10. [Page reloads with updated dashboard]
```

### Success Criteria:
- ✅ All audio plays sequentially
- ✅ No overlapping voice outputs
- ✅ Timing between sections appropriate
- ✅ Dashboard updates after reload
- ✅ XP totals correct in leaderboard

### Performance Metrics:
```
| Metric | Target | Actual |
|--------|--------|--------|
| Audio Latency | <500ms | _______ |
| Synthesis Quality | Natural | _______ |
| Speech Recognition | >70% | _______ |
| Session Duration | 2-3 min | _______ |
| No Crashes | 100% | _______ |
```

---

## Test 9: Error Handling - No Microphone

**Objective**: Verify system gracefully handles missing microphone

### Steps:
1. Disable microphone in browser settings
   - Chrome: Settings → Privacy → Microphone → Block
2. Start activity
3. Observe UI behavior

### Expected Behavior:
- ✅ Character greeting still plays (no microphone needed)
- ✅ Question still narrated
- ✅ Microphone button shows error state
- ✅ Error message explains limitation

### Success Criteria:
- ✅ No crash
- ✅ User informed of issue
- ✅ Can still hear voice output
- ✅ Graceful degradation

### Troubleshooting:
```
❌ Microphone button non-responsive
  → Browser permission issue
  → Try different browser
  → Clear browser cache
  → Check: Settings > Privacy > Microphone > Allow for localhost
```

---

## Test 10: Error Handling - Voice Synthesis Unavailable

**Objective**: Verify system handles TTS unavailable

### Steps:
1. Disable Web Audio in browser DevTools
   - F12 → Console → `speechSynthesis.cancel()`
2. Start activity
3. Attempt voice interaction

### Expected Behavior:
- ✅ Questions still display visually
- ✅ Voice output attempts gracefully fail
- ✅ System continues functioning
- ✅ Can still record answers

### Success Criteria:
- ✅ No crash
- ✅ Visual backup text present
- ✅ Questions readable on screen
- ✅ Input still works

### Recovery:
```
To restore: Refresh page and check browser audio settings
```

---

## Test 11: Different Activity Types

**Objective**: Verify voice output works for all 4 activities

Test each activity with full voice flow:

### Activity 1: Number Recognition
```
Character: Max (🤖)
Greeting: "Hi! I'm Max. Let's recognize numbers!"
Questions: "What number is this? Three"
Expected: User says "Three"
```

### Activity 2: Counting Adventure
```
Character: Dragon (🐉)
Greeting: "Hello! I'm a dragon. Let's count!"
Questions: "Count from one to ten"
Expected: User says "1, 2, 3, ..."
```

### Activity 3: Basic Math
```
Character: Sophie (👧)
Greeting: "Hi there! I'm Sophie. Math time!"
Questions: "What is 2 plus 3?"
Expected: User says "5"
```

### Activity 4: Alphabet Learning
```
Character: Owl (🦉)
Greeting: "Hoot! I'm an owl. Let's learn letters!"
Questions: "Say the letter: A"
Expected: User says "A" or "Ay"
```

### Checklist:
- [ ] All 4 activities have working voice output
- [ ] Each character greeting is distinct
- [ ] All questions narrated clearly
- [ ] XP announcements appropriate
- [ ] No character-specific errors

---

## Test 12: Audio Performance

**Objective**: Verify audio quality and latency

### Measurements:
```
1. Audio Latency Test
   - Start question narration timer (console.time)
   - Measure time until first audio output
   - Target: <500ms

2. Speech Recognition Latency
   - Click microphone button timer
   - Measure time until transcription appears
   - Target: <3 seconds for 5-word answer

3. Synthesis Quality Check
   - Rate voice naturalness (1-10)
   - Check for robotic/synthetic artifacts
   - Verify pitch and prosody appropriate for children
```

### Results Table:
```
| Test | Latency | Quality | Notes |
|------|---------|---------|-------|
| Q1 Narration | __ms | __/10 | _________ |
| Q1 Listening | __ms | __/10 | _________ |
| Q1 Feedback | __ms | __/10 | _________ |
| SR Recognition | __ms | __/10 | _________ |
| XP Announce | __ms | __/10 | _________ |
| Next Q Prompt | __ms | __/10 | _________ |
```

---

## Test 13: Concurrent Audio

**Objective**: Test system doesn't play overlapping audio

### Steps:
1. Start activity
2. Monitor: Don't let any two voice outputs overlap
3. Verify sequential timing

### Expected:
```
Timeline:
0s:    Greeting plays (duration ~3s)
3s:    Greeting ends, question starts (duration ~2s)
5s:    Question ends, listening prompt starts (duration ~2s)
7s:    Ready for user input
```

### Fail Cases:
```
❌ Overlapping audio (e.g., greeting + question play together)
❌ Lost audio segments
❌ Silence where audio expected
```

### Fix Strategy:
```
If overlapping occurs:
1. Add longer delays between audio in voice-input.js
2. Use speakCompletion callbacks to sequence properly
3. Queue audio instead of playing immediately
```

---

## Browser Compatibility Matrix

Test in each browser:

```
| Feature | Chrome | Safari | Edge | Firefox |
|---------|--------|--------|------|---------|
| Speech Recognition | ✅ | ✅ | ✅ | ❌ |
| Speech Synthesis | ✅ | ✅ | ✅ | ✅ |
| Web Audio API | ✅ | ✅ | ✅ | ✅ |
| getUserMedia | ✅ | ✅ | ✅ | ✅ |

NOTES:
- Chrome: Best support, most stable
- Safari: Requires permissions, slow first-run
- Edge: Chromium-based, similar to Chrome
- Firefox: No native Speech Recognition API
```

---

## Success Criteria - Full System

For complete voice output integration:

### Audio Output
- [ ] 12 voice feedback methods working
- [ ] 6 announcement methods firing correctly
- [ ] No audio overlaps
- [ ] Latency <2 seconds per action
- [ ] Audio quality natural and clear

### Integration
- [ ] Session start announces greeting
- [ ] Questions narrated automatically
- [ ] Listening prompts play
- [ ] Correctness feedback audible
- [ ] XP announcements clear
- [ ] Next question transitions smooth

### User Experience
- [ ] Instructions clear entirely through voice
- [ ] No required visual reading for core interaction
- [ ] Timing feels natural
- [ ] User knows next action always
- [ ] Encouragement throughout

### Error Handling
- [ ] Graceful degradation if TTS unavailable
- [ ] Clear error messages for microphone issues
- [ ] System continues despite audio problems
- [ ] No crashes or console errors

### Data Collection
- [ ] All responses recorded
- [ ] XP properly calculated
- [ ] Session data persisted
- [ ] Dashboard reflects performance

---

## Quick Test Checklist

**For rapid validation** (5 minutes):
```
□ Open http://localhost:3000
□ Click "Start Activity"
□ LISTEN for greeting
□ LISTEN for question
□ Click microphone button
□ Say "1, 2, 3"
□ LISTEN for feedback
□ LISTEN for XP announcement
□ Dashboard updates on reload
✅ If all 8 items checked = SUCCESS
```

---

## Documentation & Resources

### Related Guides:
- **VOICE_INPUT_GUIDE.md** - Detailed voice input testing
- **VOICE_IMPLEMENTATION_SUMMARY.md** - Technical architecture
- **VOICE_OUTPUT_COMPLETE.md** - Voice output methods

### Console Debugging:
```javascript
// Check if voice is available
window.currentVoiceManager.isAvailable()
// Output: true

// Manually trigger announcement
window.currentLauncher.announceSessionStart()
// Should hear greeting immediately

// Check speech synthesis status
window.speechSynthesis.speaking
// Output: true (if audio playing)

// List available voices
window.speechSynthesis.getVoices()
// Shows array of browser voices
```

### Browser Console Tests:
```javascript
// Test 1: Verify voice manager exists
console.log(window.currentVoiceManager);

// Test 2: Manually speak something
window.currentVoiceManager.feedback.speak("Hello, I am working!");

// Test 3: Check if listening
console.log(window.currentVoiceManager.isListening());

// Test 4: Test question narration
const testQuestion = { narration: "This is a test question" };
window.currentVoiceManager.speakQuestion(testQuestion);
```

---

## Reporting Issues

When reporting problems, include:
1. Browser name and version
2. Operating system
3. Exact audio output you heard (or didn't hear)
4. Console error messages (if any)
5. Steps to reproduce
6. Logs from `VOICE_TEST_GUIDE.md` Test X

Example:
```
Issue: No greeting heard on activity start
Browser: Chrome 120.0.6099.71
OS: Windows 11
Reproduction: 
  1. Opened http://localhost:3000
  2. Clicked "Number Recognition"
  3. Waited 5 seconds - no audio
Error: (paste console error here)
```

---

**Test Version**: 2.0  
**Last Updated**: December 3, 2025  
**Status**: ✅ Ready for User Testing
