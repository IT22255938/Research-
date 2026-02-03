# Voice Integration - Implementation Examples

## How to Use in Your Activities

### Example 1: Simple Question Activity

```javascript
// File: src/activities/simple-question.js
import { VoiceIntegration } from '../audio/voice-integration.js';

export class SimpleQuestion {
  constructor() {
    this.voice = new VoiceIntegration({
      defaultCharacter: 'sophie'
    });
  }

  async ask(questionText, expectedAnswers) {
    try {
      // Step 1: Ask the question
      await this.voice.askQuestion(questionText);

      // Step 2: Listen for student's response
      const response = await this.voice.listenForResponse({
        timeout: 15000
      });

      // Step 3: Check if answer is correct
      const { isCorrect, feedback } = await this.voice.processAnswer(
        response.text,
        expectedAnswers
      );

      return {
        isCorrect,
        studentAnswer: response.text,
        confidence: response.confidence,
        xp: isCorrect ? 10 : 0
      };
    } catch (error) {
      console.error('Question failed:', error);
      return { isCorrect: false, xp: 0 };
    }
  }
}

// Usage
const activity = new SimpleQuestion();
const result = await activity.ask(
  'What is the capital of France?',
  ['Paris', 'paris']
);

console.log(`Answer: ${result.studentAnswer}`);
console.log(`Correct: ${result.isCorrect}`);
console.log(`XP: ${result.xp}`);
```

---

### Example 2: Multi-Turn Dialogue Activity

```javascript
// File: src/activities/dialogue-activity.js
import { VoiceIntegration } from '../audio/voice-integration.js';

export class DialogueActivity {
  constructor(characterName = 'buddy') {
    this.voice = new VoiceIntegration({
      defaultCharacter: characterName
    });
    this.conversationHistory = [];
  }

  async runConversation(dialogueScript) {
    for (const turn of dialogueScript) {
      // Character speaks
      await this.voice.speak(turn.characterText, {
        character: turn.character,
        emotionalTone: turn.emotion
      });

      // Listen for student response
      try {
        const response = await this.voice.listenForResponse({
          timeout: 20000
        });

        this.conversationHistory.push({
          type: 'student',
          text: response.text,
          confidence: response.confidence
        });

        // Validate against expected responses
        const isValid = this.validateResponse(
          response.text,
          turn.expectedResponses
        );

        if (isValid) {
          // Continue dialogue
          await this.voice.speakAsCharacter(
            turn.successResponse,
            turn.character,
            'encouraging'
          );
        } else {
          // Ask again
          await this.voice.speakAsCharacter(
            turn.retryResponse,
            turn.character,
            'calm'
          );
        }

      } catch (error) {
        console.error('Conversation error:', error);
        break;
      }
    }

    return this.conversationHistory;
  }

  validateResponse(text, expectedResponses) {
    return expectedResponses.some(expected =>
      text.toLowerCase().includes(expected.toLowerCase())
    );
  }
}

// Usage
const dialogue = new DialogueActivity('teacher');

const script = [
  {
    characterText: 'Hello! What is your name?',
    character: 'teacher',
    emotion: 'calm',
    expectedResponses: ['my name is', "i'm", "i am"],
    successResponse: 'Nice to meet you!',
    retryResponse: 'Can you tell me your name?'
  },
  {
    characterText: 'How old are you?',
    character: 'teacher',
    emotion: 'calm',
    expectedResponses: ['5', 'six', 'seven', 'eight'],
    successResponse: 'Thank you for telling me!',
    retryResponse: 'How many years old are you?'
  }
];

const history = await dialogue.runConversation(script);
console.log('Conversation completed');
console.log(history);
```

---

### Example 3: Math Adventure with Levels

```javascript
// File: src/activities/math-adventure.js
import { VoiceIntegration } from '../audio/voice-integration.js';

export class MathAdventure {
  constructor() {
    this.voice = new VoiceIntegration({
      defaultCharacter: 'dragon'
    });
    this.level = 1;
    this.score = 0;
    this.questionsAnswered = 0;
  }

  async startAdventure() {
    // Welcome
    await this.voice.speakAsCharacter(
      `Welcome brave adventurer! I am the Dragon. Let's solve math problems together!`,
      'dragon',
      'celebration'
    );

    // Play 5 questions
    for (let i = 0; i < 5; i++) {
      await this.askQuestion(i + 1);
    }

    // Summary
    const accuracy = Math.round((this.score / (this.questionsAnswered * 10)) * 100);
    await this.voice.speakAsCharacter(
      `You earned ${this.score} points with ${accuracy}% accuracy! Amazing work!`,
      'dragon',
      'celebration'
    );

    return { score: this.score, level: this.level };
  }

  async askQuestion(questionNumber) {
    const { num1, num2, operation, answer } = this.generateProblem();

    const questionText = `${operation === '+' ? 'Add' : 'Subtract'} ${num1} ${operation} ${num2}`;
    const narration = `Question ${questionNumber}: What is ${num1} ${operation} ${num2}?`;

    await this.voice.askQuestion(questionText, {
      character: 'dragon',
      narration
    });

    try {
      const response = await this.voice.listenForResponse();

      const { isCorrect } = await this.voice.processAnswer(
        response.text,
        [answer.toString(), this.numberToWords(answer)],
        'dragon'
      );

      if (isCorrect) {
        this.score += 10;
        // Give bonus for fast answer
        if (response.confidence > 0.8) {
          this.score += 5;
          await this.voice.speakAsCharacter(
            'And you were confident too! Bonus 5 points!',
            'dragon',
            'celebratory'
          );
        }
      }

      this.questionsAnswered++;

    } catch (error) {
      await this.voice.speakAsCharacter(
        'Let me ask the next question.',
        'dragon',
        'calm'
      );
    }
  }

  generateProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() > 0.5 ? '+' : '-';
    const answer = operation === '+' ? num1 + num2 : num1 - num2;

    return { num1, num2, operation, answer };
  }

  numberToWords(num) {
    const words = [
      'zero', 'one', 'two', 'three', 'four', 'five',
      'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
      'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
      'seventeen', 'eighteen', 'nineteen', 'twenty'
    ];
    return words[num] || num.toString();
  }
}

// Usage
const adventure = new MathAdventure();
const result = await adventure.startAdventure();
console.log('Adventure complete:', result);
```

---

### Example 4: Story-Based Activity

```javascript
// File: src/activities/story-activity.js
import { VoiceIntegration } from '../audio/voice-integration.js';

export class StoryActivity {
  constructor() {
    this.voice = new VoiceIntegration({
      defaultCharacter: 'fairy'
    });
    this.currentPage = 0;
  }

  async readStory(storyPages) {
    for (const page of storyPages) {
      // Narrator reads the story
      await this.voice.speak(page.narration, {
        character: 'teacher',
        emotionalTone: 'calm'
      });

      // Character asks question
      if (page.question) {
        const response = await this.voice.listenForResponse({
          timeout: 20000
        });

        console.log('Student said:', response.text);
      }

      this.currentPage++;
    }
  }
}

// Usage
const story = new StoryActivity();

const storyPages = [
  {
    narration: 'Once upon a time, there was a little girl named Sophie...',
    question: null
  },
  {
    narration: 'She found a magical dragon in the forest. What do you think she should do?',
    question: {
      expectedAnswers: ['talk', 'ask', 'speak', 'hello']
    }
  }
];

await story.readStory(storyPages);
```

---

### Example 5: Game Mode with Scoring

```javascript
// File: src/activities/game-mode.js
import { VoiceIntegration } from '../audio/voice-integration.js';

export class GameMode {
  constructor() {
    this.voice = new VoiceIntegration({ defaultCharacter: 'buddy' });
    this.stats = {
      correct: 0,
      incorrect: 0,
      totalXP: 0,
      streak: 0,
      bestStreak: 0
    };
  }

  async playGame(questions) {
    for (const question of questions) {
      const response = await this.voice.listenForResponse();

      const { isCorrect } = await this.voice.processAnswer(
        response.text,
        question.expectedAnswers
      );

      if (isCorrect) {
        this.stats.correct++;
        this.stats.streak++;
        this.stats.totalXP += 10;

        if (this.stats.streak > this.stats.bestStreak) {
          this.stats.bestStreak = this.stats.streak;
          
          if (this.stats.streak >= 5) {
            await this.voice.speakAsCharacter(
              `Amazing! ${this.stats.streak} in a row! Keep going!`,
              'buddy',
              'celebratory'
            );
          }
        }
      } else {
        this.stats.incorrect++;
        this.stats.streak = 0;
      }
    }

    return this.stats;
  }
}
```

---

### Example 6: Adaptive Difficulty

```javascript
// File: src/activities/adaptive-activity.js
import { VoiceIntegration } from '../audio/voice-integration.js';

export class AdaptiveActivity {
  constructor() {
    this.voice = new VoiceIntegration({ defaultCharacter: 'teacher' });
    this.difficulty = 1;
    this.correctCount = 0;
  }

  async runAdaptiveQuestions() {
    const questionsDb = {
      1: [
        { text: '1 + 1?', answers: ['2', 'two'] },
        { text: '2 + 1?', answers: ['3', 'three'] }
      ],
      2: [
        { text: '5 + 3?', answers: ['8', 'eight'] },
        { text: '10 - 2?', answers: ['8', 'eight'] }
      ],
      3: [
        { text: '12 + 8?', answers: ['20', 'twenty'] },
        { text: '15 - 7?', answers: ['8', 'eight'] }
      ]
    };

    for (let i = 0; i < 10; i++) {
      const questionPool = questionsDb[this.difficulty];
      const question = questionPool[Math.floor(Math.random() * questionPool.length)];

      const response = await this.voice.listenForResponse();
      const { isCorrect } = await this.voice.processAnswer(
        response.text,
        question.answers
      );

      if (isCorrect) {
        this.correctCount++;

        // Adapt difficulty
        if (this.correctCount >= 2) {
          this.difficulty++;
          this.correctCount = 0;

          await this.voice.speakAsCharacter(
            `You're doing great! Let's try harder questions!`,
            'teacher',
            'encouraging'
          );
        }
      } else {
        this.correctCount = 0;
      }
    }
  }
}
```

---

## 🔗 Integration Points

### In HTML
```html
<!-- Add voice feedback div -->
<div id="voice-feedback"></div>
<div id="voice-transcription"></div>

<!-- Include module -->
<script type="module">
  import { VoiceIntegration } from './src/audio/voice-integration.js';
  // Your code here
</script>
```

### In Activities Launcher
```javascript
// activities/activity-launcher.js
import { VoiceIntegration } from '../audio/voice-integration.js';

export class ActivityLauncher {
  async runActivity(activityName) {
    const voice = new VoiceIntegration({
      defaultCharacter: this.getCharacter(activityName)
    });

    // Use voice throughout activity
    const question = this.getQuestion();
    const response = await voice.listenForResponse();
    // ... continue
  }
}
```

---

## ✅ Checklist for Integration

- [ ] Import VoiceIntegration
- [ ] Create instance with options
- [ ] Add event listeners
- [ ] Use askQuestion() for narration
- [ ] Use listenForResponse() to get answer
- [ ] Use processAnswer() for validation
- [ ] Update UI with feedback
- [ ] Handle errors gracefully
- [ ] Test with voice
- [ ] Verify all characters work
- [ ] Check emotions apply correctly

---

**Next Steps**: 
1. Choose an example above
2. Copy to your activity file
3. Test with `npm run dev`
4. Visit `http://localhost:3000`
5. Interact with voice features!
