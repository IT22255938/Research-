# 🔧 Interactive Elements - Code Examples & API Reference

## API Reference

### Sound Effects API

#### `playTone(frequency, duration)`
Generates a sine wave tone using Web Audio API.

**Parameters**
```javascript
frequency  {number}  Frequency in Hz (e.g., 800)
duration   {number}  Duration in milliseconds (e.g., 100)
```

**Returns**: void

**Example**
```javascript
playTone(800, 100);        // 800 Hz beep for 100ms
playTone(400, 150);        // 400 Hz beep for 150ms
playTone(1200, 100);       // 1200 Hz beep for 100ms
```

**Behavior**
- Creates Web Audio Context if not exists
- Generates sine wave oscillator
- Exponential volume fade-out
- Auto-cleanup after completion

---

#### `soundEffects.correct()`
Plays correct answer feedback tone.

**Parameters**: None

**Returns**: void

**Example**
```javascript
soundEffects.correct();    // Plays 800 Hz tone
```

**Sound**
- Frequency: 800 Hz
- Duration: 100ms
- Meaning: Positive, correct answer

---

#### `soundEffects.incorrect()`
Plays incorrect answer feedback tone.

**Parameters**: None

**Returns**: void

**Example**
```javascript
soundEffects.incorrect();  // Plays 400 Hz tone
```

**Sound**
- Frequency: 400 Hz
- Duration: 150ms
- Meaning: Lower, informative, incorrect

---

#### `soundEffects.celebrate()`
Plays celebration sound progression.

**Parameters**: None

**Returns**: void

**Example**
```javascript
soundEffects.celebrate();  // Plays 3-tone progression
```

**Sound Sequence**
- Tone 1: 600 Hz (100ms)
- Tone 2: 800 Hz (100ms)
- Tone 3: 1000 Hz (100ms)
- Total: 300ms ascending pitch

---

#### `soundEffects.levelUp()`
Plays level-up achievement tone.

**Parameters**: None

**Returns**: void

**Example**
```javascript
soundEffects.levelUp();    // Plays ascending tones
```

**Sound Sequence**
- Tone 1: 1200 Hz (100ms)
- Tone 2: 1500 Hz (100ms)
- Total: 200ms rapid ascent

---

### Animation Trigger API

#### `triggerSuccess(message)`
Triggers success animation sequence.

**Parameters**
```javascript
message   {string}  Optional message to display (default: '✨ Correct!')
```

**Returns**: void

**Example**
```javascript
triggerSuccess();                    // Default message
triggerSuccess('Fantastic!');        // Custom message
triggerSuccess('⭐ Well done!');    // With emoji
```

**Triggered Animations**
1. Plays 800 Hz correct sound
2. Shows ⭐ achievement emoji
3. Displays "+10 XP" floating text
4. Mascot bounces (happy reaction)
5. Animates progress bar
6. Shows mascot message

**Timing**: 2-3 seconds total sequence

---

#### `triggerFailure()`
Triggers failure animation sequence.

**Parameters**: None

**Returns**: void

**Example**
```javascript
triggerFailure();
```

**Triggered Animations**
1. Plays 400 Hz incorrect sound
2. Mascot shakes (sad reaction)
3. Shows encouraging message
4. Displays mascot speech bubble

**Timing**: ~1 second

---

#### `triggerCelebration()`
Triggers full celebration sequence.

**Parameters**: None

**Returns**: void

**Example**
```javascript
triggerCelebration();
```

**Triggered Animations**
1. Plays celebration sound progression (3 tones)
2. Generates 30-particle confetti burst
3. Shows 🏆 trophy emoji
4. Mascot spins/dances (1000ms)
5. Displays celebration message
6. Updates progress metrics

**Timing**: 3-4 seconds

**Precondition**: Typically called on perfect score (100% accuracy)

---

#### `triggerLevelUp()`
Triggers level-up notification.

**Parameters**: None

**Returns**: void

**Example**
```javascript
triggerLevelUp();
```

**Triggered Animations**
1. Plays level-up sound (1200→1500 Hz)
2. Shows level-up achievement
3. Updates difficulty indicator
4. Animates confetti (optional)
5. Shows achievement message

**Timing**: 2 seconds

**Precondition**: Called after difficulty advancement

---

#### `triggerAchievementPopup(emoji)`
Displays achievement emoji popup.

**Parameters**
```javascript
emoji   {string}  Emoji character to display
```

**Returns**: void

**Example**
```javascript
triggerAchievementPopup('⭐');
triggerAchievementPopup('🏆');
triggerAchievementPopup('🎯');
```

**Behavior**
- Scales emoji 0 → 1.3 → 1.0
- Bounces with cubic easing
- Fades after 2 seconds
- Positioned center-top

---

#### `triggerXPFloat(amount, x, y)`
Displays floating XP text.

**Parameters**
```javascript
amount   {number}  XP amount (e.g., 10)
x        {number}  Horizontal position (px)
y        {number}  Vertical position (px)
```

**Returns**: void

**Example**
```javascript
triggerXPFloat(10, 500, 300);      // +10 XP at (500, 300)
triggerXPFloat(25, 600, 250);      // +25 XP bonus
triggerXPFloat(5, 400, 350);       // +5 XP participation
```

**Behavior**
- Creates "+{amount} XP" text
- Gold color (#FFD700)
- Rises 400px over 2 seconds
- Fades out gradually
- Auto-cleanup after animation

---

### Progress Animation API

#### `animateProgressBar(element, targetWidth, duration)`
Animates progress bar fill.

**Parameters**
```javascript
element     {HTMLElement}  Bar element to animate
targetWidth {number}       Target width percentage (0-100)
duration    {number}       Animation duration in ms (default: 600)
```

**Returns**: void

**Example**
```javascript
const accuracyBar = document.getElementById('accuracy-bar');
animateProgressBar(accuracyBar, 85, 600);     // Fill to 85% in 600ms
animateProgressBar(accuracyBar, 100);         // Fill to 100% (default 600ms)
```

**Easing Function**
```
cubic-bezier(0.34, 1.56, 0.64, 1)
```

**Behavior**
- Smooth cubic-bezier easing
- Pulse glow effect at completion
- No animation jumps
- Works with percentage bars

---

#### `animateStreak()`
Animates streak counter.

**Parameters**: None

**Returns**: void

**Example**
```javascript
animateStreak();
```

**Animation**
- Applies flame flicker effect
- 1.5 second duration
- Pulses and glows
- Indicates streak status

---

### Mascot Interaction API

#### `mascotReact(emotion)`
Triggers mascot animation based on emotion.

**Parameters**
```javascript
emotion   {string}  'happy' | 'celebrate' | 'sad'
```

**Returns**: void

**Example**
```javascript
mascotReact('happy');       // Happy bounce
mascotReact('celebrate');   // Celebration spin
mascotReact('sad');         // Sad shake
```

**Animations**
```
'happy':     Bounce animation (600ms)
'celebrate': 360° spin (1000ms)
'sad':       Shake animation (400ms)
```

---

#### `showMascotMessage(message)`
Displays message in mascot speech bubble.

**Parameters**
```javascript
message   {string}  Message text to display
```

**Returns**: void

**Example**
```javascript
showMascotMessage('Great job!');
showMascotMessage('Try again!');
showMascotMessage('You\'re amazing!');
```

**Behavior**
- Creates blue speech bubble
- Shows message with pointer
- Auto-hides after 3 seconds
- Positioned above mascot

---

#### `mascotInteraction()`
Handles mascot click interaction.

**Parameters**: None

**Returns**: void

**Example**
```javascript
// Automatically bound to mascot click
document.getElementById('mascot').onclick = mascotInteraction;

// Or call directly
mascotInteraction();
```

**Behavior**
1. Mascot bounces (happy)
2. Random message shows
3. Mascot reacts with animation
4. Message auto-hides (3s)

---

### Particle Effects API

#### `createConfetti()`
Generates confetti particle burst.

**Parameters**: None

**Returns**: void

**Example**
```javascript
createConfetti();
```

**Behavior**
- Creates 30 particles
- Random colors from palette
- Spreads ±200px horizontally
- Falls for 3 seconds
- Rotates 720 degrees each
- Auto-cleanup after animation

**Particle Properties**
```javascript
{
    color: string,         // Random confetti color
    left: number,          // ±200px horizontal
    duration: 3000,        // 3000ms fall
    rotation: 720,         // 720° rotation
    opacity: 1 → 0         // Fade effect
}
```

**Colors Used**
- #ffd700 (Gold)
- #ff6b6b (Red)
- #4ecdc4 (Teal)
- #45b7d1 (Light Blue)
- #f9ca24 (Yellow)

---

## Complete Usage Examples

### Example 1: Answer Validation with Effects

```javascript
function handleAnswerResponse(isCorrect) {
    if (isCorrect) {
        // Play success sequence
        triggerSuccess('Correct!');
        
        // Update progress
        const newAccuracy = calculateAccuracy();
        animateProgressBar(
            document.getElementById('accuracy-bar'),
            newAccuracy,
            600
        );
        
        // Update streak
        incrementStreak();
        animateStreak();
        
    } else {
        // Play failure sequence
        triggerFailure();
        
        // Show encouragement
        const messages = [
            'Try again!',
            'Almost there!',
            'Don\'t worry, keep practicing!'
        ];
        showMascotMessage(
            messages[Math.floor(Math.random() * messages.length)]
        );
    }
}
```

---

### Example 2: Activity Completion

```javascript
function completeActivity(results) {
    const { total, correct } = results;
    const perfectScore = correct === total;
    
    if (perfectScore) {
        // Full celebration!
        triggerCelebration();
        triggerLevelUp();
        
        // Show results
        displayCompletionModal({
            title: '🎉 Perfect Score!',
            stats: results
        });
        
    } else {
        // Partial success
        const accuracy = Math.round((correct / total) * 100);
        
        triggerAchievementPopup('🌟');
        
        if (accuracy >= 80) {
            showMascotMessage('Great work! Almost perfect!');
        } else {
            showMascotMessage('Good effort! Try again!');
        }
        
        displayCompletionModal({
            title: 'Activity Complete',
            stats: results
        });
    }
}
```

---

### Example 3: Real-Time Progress Tracking

```javascript
function updateProgressInRealTime() {
    // As user answers questions
    const questions = getActivityQuestions();
    let correct = 0;
    
    for (let i = 0; i < questions.length; i++) {
        const answered = checkIfAnswered(questions[i]);
        
        if (answered && answered.isCorrect) {
            correct++;
            
            // Animate progress immediately
            const accuracy = Math.round((correct / (i + 1)) * 100);
            
            animateProgressBar(
                document.getElementById('accuracy-bar'),
                accuracy,
                500
            );
            
            triggerSuccess('✨ Correct!');
        }
    }
}
```

---

### Example 4: Custom Sound Sequences

```javascript
function customSoundSequence(tones) {
    // Create custom tone sequence
    let delay = 0;
    
    tones.forEach(({ frequency, duration }) => {
        setTimeout(() => {
            playTone(frequency, duration);
        }, delay);
        
        delay += duration + 50; // 50ms gap between tones
    });
}

// Usage
customSoundSequence([
    { frequency: 800, duration: 100 },
    { frequency: 1000, duration: 100 },
    { frequency: 1200, duration: 100 }
]);
```

---

### Example 5: Mascot Message Database

```javascript
const mascotMessages = {
    happy: [
        'Great job!',
        'Keep going!',
        'You\'re awesome!',
        'Nice answer!',
        'Well done!'
    ],
    sad: [
        'Try again!',
        'Almost there!',
        'Don\'t worry, you\'ve got this!',
        'Keep practicing!'
    ],
    celebrate: [
        'Perfect score!',
        'You\'re amazing!',
        'Level up!',
        'Outstanding work!',
        '👏 Fantastic work!'
    ]
};

function getRandomMessage(emotion) {
    const messages = mascotMessages[emotion];
    return messages[Math.floor(Math.random() * messages.length)];
}
```

---

### Example 6: Progress Bar with Easing

```javascript
function smoothProgressAnimation(element, targetWidth) {
    const easeOutCubic = (t) => {
        return 1 - Math.pow(1 - t, 3);
    };
    
    const startWidth = parseFloat(element.style.width) || 0;
    const difference = targetWidth - startWidth;
    const duration = 600;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        
        element.style.width = (startWidth + difference * eased) + '%';
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Pulse effect at completion
            element.classList.add('pulse');
            setTimeout(() => {
                element.classList.remove('pulse');
            }, 1500);
        }
    }
    
    requestAnimationFrame(animate);
}
```

---

### Example 7: Confetti with Custom Settings

```javascript
function createCustomConfetti(options = {}) {
    const {
        particleCount = 30,
        duration = 3000,
        spread = 200,
        colors = ['#ffd700', '#ff6b6b', '#4ecdc4']
    } = options;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        particle.innerHTML = '✨';
        particle.style.position = 'fixed';
        particle.style.left = (Math.random() * spread - spread/2) + 'px';
        particle.style.top = '-20px';
        particle.style.fontSize = '20px';
        particle.style.zIndex = '1000';
        particle.style.pointerEvents = 'none';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
        
        document.body.appendChild(particle);
        
        // Animate with CSS
        particle.animate([
            {
                opacity: 1,
                transform: `translateY(0) rotate(0deg)`,
                top: '-20px'
            },
            {
                opacity: 0,
                transform: `translateY(800px) rotate(720deg)`,
                top: `calc(100vh - 800px)`
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        // Cleanup
        setTimeout(() => particle.remove(), duration);
    }
}

// Usage
createCustomConfetti({ particleCount: 50, duration: 5000 });
```

---

### Example 8: Responsive Animation Adjustment

```javascript
function adjustAnimationsForDevice() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Reduce animations on mobile
        document.documentElement.style.setProperty(
            '--animation-duration',
            '400ms'
        );
        
        // Reduce confetti particles
        window.CONFETTI_PARTICLE_COUNT = 15;
        
    } else if (window.innerWidth < 1024) {
        // Tablet settings
        document.documentElement.style.setProperty(
            '--animation-duration',
            '500ms'
        );
        
        window.CONFETTI_PARTICLE_COUNT = 25;
        
    } else {
        // Desktop - full animations
        document.documentElement.style.setProperty(
            '--animation-duration',
            '600ms'
        );
        
        window.CONFETTI_PARTICLE_COUNT = 30;
    }
}

// Call on load and resize
window.addEventListener('load', adjustAnimationsForDevice);
window.addEventListener('resize', adjustAnimationsForDevice);
```

---

## Debugging & Troubleshooting

### Check if Web Audio API Works

```javascript
function checkWebAudio() {
    const audioContext = window.AudioContext || window.webkitAudioContext;
    
    if (audioContext) {
        console.log('✅ Web Audio API supported');
        return true;
    } else {
        console.warn('⚠️ Web Audio API not supported');
        return false;
    }
}
```

---

### Test Sound Playback

```javascript
function testSoundEffects() {
    console.log('Testing sound effects...');
    
    console.log('Playing correct sound (800Hz)...');
    soundEffects.correct();
    
    setTimeout(() => {
        console.log('Playing incorrect sound (400Hz)...');
        soundEffects.incorrect();
    }, 500);
    
    setTimeout(() => {
        console.log('Playing celebrate sound...');
        soundEffects.celebrate();
    }, 1000);
}

// Run in console: testSoundEffects()
```

---

### Monitor Animation Performance

```javascript
function monitorAnimationPerformance() {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 16.67) {
                console.warn('⚠️ Animation frame took', entry.duration, 'ms');
            }
        }
    });
    
    observer.observe({ entryTypes: ['measure'] });
}
```

---

## Performance Optimization Tips

**For Smooth Animations**
```javascript
// Use transform for GPU acceleration
element.style.transform = 'translateY(100px)';

// Avoid
element.style.top = '100px';

// Use opacity for fade effects
element.style.opacity = '0.5';

// Avoid
element.style.display = 'none'; // Use for complete hide only
```

---

**Batch DOM Updates**
```javascript
// Instead of updating one at a time
for (let i = 0; i < 1000; i++) {
    element.style.width = i + 'px'; // Creates reflow each time
}

// Use documentFragment
const fragment = document.createDocumentFragment();
const temp = document.createElement('div');
for (let i = 0; i < 1000; i++) {
    temp.style.width = i + 'px';
}
fragment.appendChild(temp);
```

---

## API Summary Table

| Function | Parameters | Returns | Use Case |
|----------|-----------|---------|----------|
| `playTone()` | frequency, duration | void | Custom sounds |
| `triggerSuccess()` | message | void | Correct answers |
| `triggerFailure()` | none | void | Wrong answers |
| `triggerCelebration()` | none | void | Perfect score |
| `triggerLevelUp()` | none | void | Difficulty up |
| `triggerAchievementPopup()` | emoji | void | Achievements |
| `triggerXPFloat()` | amount, x, y | void | XP display |
| `mascotReact()` | emotion | void | Mascot animation |
| `showMascotMessage()` | message | void | Mascot speech |
| `animateProgressBar()` | element, width, duration | void | Bar animation |
| `animateStreak()` | none | void | Streak effect |
| `createConfetti()` | none | void | Particle burst |

---

**All APIs are ready for production use!** 🚀✨
