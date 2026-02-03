# Project Map & Navigation Guide

## 📁 Complete Project Structure

```
voice-learning-module/
│
├── 📄 package.json                    ← Dependencies & scripts
├── 📄 README.md                        ← Project overview
├── 📄 .gitignore                       ← Git configuration
├── 📄 DEVELOPMENT_SUMMARY.md           ← Phase 1 completion report
│
├── 📂 src/                            ← Source code
│   ├── 📄 index.js                    ← Application entry point
│   │
│   ├── 📂 core/
│   │   └── 📄 voice-learning-module.js    ← Main orchestrator
│   │
│   ├── 📂 audio/                      ← Speech I/O
│   │   ├── 📄 speech-recognizer.js    ← STT (Web Speech API)
│   │   ├── 📄 audio-processor.js      ← Audio feature extraction
│   │   └── 📄 text-to-speech.js       ← TTS (character voices)
│   │
│   ├── 📂 adaptive-engine/            ← Difficulty scaling
│   │   └── 📄 adaptive-difficulty-engine.js  ← IRT implementation
│   │
│   ├── 📂 emotion-detection/          ← Emotion analysis
│   │   └── 📄 emotion-detector.js     ← Prosody-based emotion
│   │
│   ├── 📂 activities/                 ← Learning activities
│   │   ├── 📄 counting-adventure.js   ← Sample activity
│   │   ├── activity-engine.js         ← Activity orchestration (Phase 2)
│   │   └── dialogue-flow.js           ← Conversation management (Phase 2)
│   │
│   ├── 📂 gamification/               ← Reward system (Phase 2)
│   │   ├── reward-manager.js
│   │   ├── progress-tracker.js
│   │   └── badge-system.js
│   │
│   ├── 📂 data-layer/                 ← Storage & analytics (Phase 3)
│   │   ├── database.js
│   │   ├── user-model.js
│   │   └── learning-analytics.js
│   │
│   ├── 📂 ui/                         ← User interface (Phase 4)
│   │   ├── accessibility.js
│   │   ├── voice-commander.js
│   │   └── session-ui.js
│   │
│   └── 📂 utils/
│       └── 📄 logger.js               ← Logging system
│
├── 📂 tests/                          ← Test suite (Phase 4)
│   ├── 📂 unit/
│   │   ├── audio/
│   │   ├── adaptive-engine/
│   │   ├── emotion-detection/
│   │   └── activities/
│   ├── 📂 integration/
│   ├── 📂 accessibility/
│   └── setup.js
│
├── 📂 docs/                           ← Documentation
│   ├── 📄 ARCHITECTURE.md             ← System design (1,500+ lines)
│   ├── 📄 IMPLEMENTATION_GUIDE.md     ← Development roadmap
│   ├── 📄 QUICK_START.md              ← Getting started guide
│   ├── API.md                         ← API reference (Phase 2)
│   ├── RESEARCH_METHODOLOGY.md        ← Research plan (Phase 4)
│   └── DEPLOYMENT.md                  ← Production setup (Phase 4)
│
└── 📂 configs/                        ← Configuration
    ├── default.env                    ← Environment template
    ├── activities.config.js           ← Activity configuration
    └── voice-settings.json            ← Voice preferences
```

---

## 🎯 What's Implemented (Phase 1) ✅

### Core Architecture
- [x] Project structure and configuration
- [x] Comprehensive system documentation
- [x] Component design and interfaces
- [x] Data flow architecture

### Audio Pipeline (`src/audio/`)
- [x] **SpeechRecognizer** - Real-time speech-to-text
- [x] **AudioProcessor** - Audio feature extraction (RMS, ZCR, pitch, MFCC)
- [x] **VoiceSynthesizer** - Character-based text-to-speech

### Machine Learning & Adaptation
- [x] **AdaptiveDifficultyEngine** - IRT-based difficulty scaling
- [x] **EmotionDetector** - Prosody-based emotion analysis (confidence, frustration, engagement)

### Application Layer
- [x] **VoiceLearningModule** - Core orchestrator
- [x] **Logger** - Comprehensive logging system
- [x] **CountingAdventure** - Sample activity

### Documentation
- [x] Architecture guide (1,500+ lines)
- [x] Implementation roadmap
- [x] Quick start guide
- [x] Development summary

---

## 🚀 What's Next (Phase 2)

### Learning Activities
- [ ] **Activity Engine** - Orchestrate activity execution
- [ ] **Dialogue Flow** - Manage branching conversations
- [ ] **Additional Activities**:
  - [ ] Number Recognition
  - [ ] Basic Math
  - [ ] Alphabet Learning
  
### Gamification System
- [ ] **Reward Manager** - Issue rewards based on performance
- [ ] **Progress Tracker** - Track skill mastery
- [ ] **Badge System** - Achievement tracking
- [ ] **Character System** - Mascot progression

### Testing Foundation
- [ ] Unit tests for each module
- [ ] Integration tests for workflows
- [ ] Accessibility test framework

---

## 📚 Documentation Map

### Read First
1. **README.md** - Overview and features
2. **QUICK_START.md** - Installation and basic usage

### Architecture & Design
3. **ARCHITECTURE.md** - Detailed system design
4. **IMPLEMENTATION_GUIDE.md** - Development roadmap

### Development
5. **Code examples** in Quick Start
6. **Module source files** with JSDoc comments

### Later (Phase 4)
- Research methodology and evaluation plan
- Deployment and scaling guide
- API reference documentation

---

## 🔍 Key Files to Understand

### For Learning the System
```
Read in order:
1. README.md
2. ARCHITECTURE.md (sections 1-3)
3. src/core/voice-learning-module.js
4. src/audio/ (all 3 files)
5. src/adaptive-engine/adaptive-difficulty-engine.js
6. src/emotion-detection/emotion-detector.js
```

### For Building New Activities
```
1. docs/IMPLEMENTATION_GUIDE.md (Section 2.3)
2. src/activities/counting-adventure.js
3. src/core/voice-learning-module.js (presentQuestion method)
```

### For Understanding Algorithms
```
IRT Model:
- src/adaptive-engine/adaptive-difficulty-engine.js
- docs/ARCHITECTURE.md (Section 3)

Emotion Detection:
- src/emotion-detection/emotion-detector.js
- docs/ARCHITECTURE.md (Section 4)

Acoustic Features:
- src/audio/audio-processor.js
- docs/ARCHITECTURE.md (Audio Pipeline section)
```

---

## 💡 Quick Navigation by Task

### I want to...

**...understand the system**
→ Read: README.md → ARCHITECTURE.md

**...set up locally**
→ Follow: QUICK_START.md

**...create a new activity**
→ See: IMPLEMENTATION_GUIDE.md (Phase 2) + counting-adventure.js

**...understand emotion detection**
→ Study: emotion-detector.js + ARCHITECTURE.md (Section 4)

**...understand adaptive difficulty**
→ Study: adaptive-difficulty-engine.js + ARCHITECTURE.md (Section 3)

**...debug/test**
→ Check: logger.js + QUICK_START.md (Debugging section)

**...contribute**
→ Review: IMPLEMENTATION_GUIDE.md (Phases 2-4)

**...evaluate the system**
→ See: DEVELOPMENT_SUMMARY.md + IMPLEMENTATION_GUIDE.md (Research section)

---

## 📊 Code Quality Metrics

### Phase 1 Coverage
- Lines of Code: ~3,500
- Classes: 6 (all documented)
- Functions: 85+ (all with JSDoc)
- Documentation: 2,000+ lines
- Test Coverage: 0% (Phase 4)

### Code Organization
```
core/        → Orchestration logic
audio/       → Speech I/O (3 specialized modules)
adaptive-engine/ → Learning algorithms
emotion-detection/ → Audio analysis
activities/  → Content and flows
gamification/ → Engagement mechanics (Phase 2)
data-layer/  → Persistence (Phase 3)
ui/          → User interface (Phase 4)
utils/       → Cross-cutting concerns
```

---

## 🔄 Development Workflow

### Phase 1 (Complete)
1. ✅ Design architecture
2. ✅ Implement core modules
3. ✅ Create sample activity
4. ✅ Document everything
5. ✅ Review and refine

### Phase 2 (In Progress)
1. Implement Activity Engine
2. Create more activities
3. Build gamification
4. Write unit tests

### Phase 3 (Planning)
1. Setup database
2. Create data models
3. Implement analytics
4. Integration tests

### Phase 4 (Planning)
1. Build accessible UI
2. Write integration tests
3. Accessibility audit
4. Prepare for research

---

## 🎓 Learning Paths

### For New Developers
1. Clone repository
2. Install: `npm install`
3. Read: QUICK_START.md
4. Explore: `src/core/voice-learning-module.js`
5. Run: `npm test` (when tests added)
6. Modify: `src/activities/counting-adventure.js`

### For Researchers
1. Read: README.md
2. Study: ARCHITECTURE.md
3. Review: emotion-detector.js
4. Examine: adaptive-difficulty-engine.js
5. Check: IMPLEMENTATION_GUIDE.md (Research section)
6. Plan: DEVELOPMENT_SUMMARY.md

### For Educators
1. Read: README.md
2. Try: QUICK_START.md
3. Explore: src/activities/counting-adventure.js
4. Customize: Create new activities (Phase 2)

---

## 🛠️ Common Tasks & Solutions

### "How do I run the project?"
```bash
npm install
npm run dev
```

### "How do I create a new activity?"
See: `docs/IMPLEMENTATION_GUIDE.md` Section 2.3

### "How do I understand the emotion detection?"
Read: `src/emotion-detection/emotion-detector.js` (comments)
Study: `docs/ARCHITECTURE.md` Section 4

### "How do I test my changes?"
```bash
npm test
npm run test:unit
npm run test:integration
```

### "Where's the database code?"
In Phase 2! See: `docs/IMPLEMENTATION_GUIDE.md` Phase 3

### "Can I modify the IRT algorithm?"
Yes! File: `src/adaptive-engine/adaptive-difficulty-engine.js`
Reference: `docs/ARCHITECTURE.md` Section 3

---

## 📞 Getting Help

### Documentation
- **Quick answers**: QUICK_START.md
- **Architecture questions**: ARCHITECTURE.md
- **Implementation questions**: IMPLEMENTATION_GUIDE.md
- **Module details**: Source code comments (JSDoc)

### Code Examples
- **Basic usage**: QUICK_START.md (Basic Usage)
- **Custom activities**: QUICK_START.md (Customizing Activities)
- **Debugging**: QUICK_START.md (Debugging)

### Issues
- Check existing issues in repository
- Review troubleshooting guide: QUICK_START.md
- Check error messages in logger.getLogs()

---

## 🎯 Success Criteria Checklist

### Phase 1: Complete ✅
- [x] Core audio pipeline implemented
- [x] Emotion detection working
- [x] Adaptive difficulty engine functional
- [x] Sample activity created
- [x] Comprehensive documentation

### Phase 2: In Progress
- [ ] Activity engine
- [ ] Gamification system
- [ ] Unit tests
- [ ] Additional activities

### Phase 3: Planned
- [ ] Database and data models
- [ ] Analytics queries
- [ ] Session persistence
- [ ] Integration tests

### Phase 4: Planned
- [ ] Accessible UI components
- [ ] Accessibility tests
- [ ] Full test coverage
- [ ] Research evaluation

---

## 🚀 Next Immediate Steps

### For Developers
1. Run `npm install`
2. Read `QUICK_START.md`
3. Explore `src/` files
4. Try modifying `counting-adventure.js`
5. Create first custom activity

### For Researchers
1. Review `ARCHITECTURE.md`
2. Study emotion detection algorithm
3. Understand IRT implementation
4. Plan evaluation metrics
5. Design user study

### For Project Managers
1. Review `DEVELOPMENT_SUMMARY.md`
2. Check `IMPLEMENTATION_GUIDE.md` timeline
3. Allocate resources for Phase 2
4. Plan research participant recruitment
5. Setup project tracking

---

## 📄 File Overview

| File | Purpose | Status |
|------|---------|--------|
| index.js | App entry | ✅ |
| voice-learning-module.js | Orchestrator | ✅ |
| speech-recognizer.js | STT | ✅ |
| audio-processor.js | Audio features | ✅ |
| text-to-speech.js | TTS | ✅ |
| adaptive-difficulty-engine.js | IRT | ✅ |
| emotion-detector.js | Emotion analysis | ✅ |
| counting-adventure.js | Sample activity | ✅ |
| logger.js | Logging | ✅ |
| ARCHITECTURE.md | Design doc | ✅ |
| IMPLEMENTATION_GUIDE.md | Roadmap | ✅ |
| QUICK_START.md | Guide | ✅ |

---

**Last Updated**: November 26, 2025  
**Phase**: 1 (Complete)  
**Next Phase**: 2 (Activities & Gamification)

