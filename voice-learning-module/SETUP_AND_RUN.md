# Voice Learning Module - Complete Setup & Run Guide

## System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: 500MB free space
- **Internet**: Required for dependencies

### Software Prerequisites
- **Node.js**: v16.0.0 or higher ([Download](https://nodejs.org/))
- **Python**: v3.8 or higher ([Download](https://www.python.org/))
- **Git**: Optional but recommended ([Download](https://git-scm.com/))

Verify installations:
```bash
node --version
npm --version
python --version
pip --version
```

---

## Part 1: JavaScript Frontend Setup

### Step 1: Navigate to Project Directory

```bash
cd e:\RP-2025\voice-learning-module
```

### Step 2: Install Node.js Dependencies

```bash
npm install
```

This will install:
- Bundler/dev tools (optional)
- Testing frameworks (optional)

**Current package.json dependencies:**
```json
{
  "name": "voice-learning-module",
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "node --test tests/**/*.js",
    "dev": "node --watch src/index.js"
  }
}
```

### Step 3: Verify Frontend Installation

```bash
npm list
```

### Step 4: Run Frontend (Standalone)

```bash
# Development mode with file watching
npm run dev

# Or single run
npm start

# Or run directly
node src/index.js
```

**Expected output:**
```
✓ Voice Learning Module initialized
✓ Core modules loaded
✓ Ready for session
```

---

## Part 2: Python ML Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd ml-backend
```

### Step 2: Create Python Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` prefix in terminal.

### Step 3: Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Dependencies (50+ packages):**
```
Core ML:
  - numpy>=1.21.0
  - scipy>=1.7.0
  - scikit-learn>=1.0.0
  - pandas>=1.3.0

Audio Processing:
  - librosa>=0.9.0
  - soundfile>=0.10.0

Deep Learning (Optional):
  - tensorflow>=2.10.0
  - torch>=1.10.0

NLP (Optional):
  - transformers>=4.20.0
  - spacy>=3.0.0

Web Framework:
  - flask>=2.0.0
  - flask-cors>=3.0.0

Database (Optional):
  - sqlalchemy>=1.4.0

Testing:
  - pytest>=6.2.0
```

Installation time: ~3-10 minutes (depends on internet speed and deep learning packages)

### Step 4: Configure Environment

```bash
# Copy template
cp .env.example .env

# Edit .env (optional, defaults work fine)
# Set: DEBUG=False, PORT=5000, CORS_ORIGINS=*
```

### Step 5: Verify Backend Installation

```bash
python -c "import librosa, flask; print('✓ Dependencies OK')"
```

### Step 6: Run Python Backend

**Terminal 2 (keep this running):**
```bash
# Make sure you're in ml-backend directory with venv activated
python app.py
```

**Expected output:**
```
 * Serving Flask app 'app'
 * Debug mode: off
 * Running on http://0.0.0.0:5000
 * WARNING: This is a development server. Do not use it in production.
```

### Step 7: Test Backend Health

**Terminal 3 (while backend is running):**
```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "status": "operational",
  "components": {
    "audio": "ready",
    "emotion": "ready",
    "nlu": "ready",
    "irt": "ready"
  }
}
```

---

## Part 3: Full System Run

### Setup (First Time Only)

```bash
# Terminal 1 - Frontend directory
cd e:\RP-2025\voice-learning-module
npm install

# Terminal 2 - Backend directory  
cd e:\RP-2025\voice-learning-module\ml-backend
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env
```

### Running (Every Time)

**Terminal 1 - Frontend:**
```bash
cd e:\RP-2025\voice-learning-module
npm start
```

**Terminal 2 - Backend:**
```bash
cd e:\RP-2025\voice-learning-module\ml-backend
venv\Scripts\activate  # or source venv/bin/activate
python app.py
```

**Terminal 3 - Test in Browser (Optional):**
```bash
# Create test HTML file
cat > test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Voice Learning Module Test</title>
</head>
<body>
  <h1>Voice Learning Module - Test Page</h1>
  <p>Open DevTools (F12) to see console output</p>
  
  <script type="module">
    import VoiceLearningModule from './src/core/voice-learning-module.js';
    import GamificationEngine from './src/gamification/gamification-engine.js';
    
    window.vlm = new VoiceLearningModule({ mlBackendUrl: 'http://localhost:5000' });
    window.gamification = new GamificationEngine({ autoSave: true });
    
    console.log('✓ Voice Learning Module loaded');
    console.log('✓ Gamification system loaded');
    console.log('Try: vlm.startSession()');
    console.log('Try: gamification.rewardForActivity("test", {correct: true, timeTaken: 3, difficulty: 0.5})');
  </script>
</body>
</html>
EOF

# Open in browser
start test.html  # Windows
# open test.html  # macOS
# xdg-open test.html  # Linux
```

---

## Part 4: Testing Components

### Test Frontend Gamification

```bash
cd src/gamification
node --input-type=module --eval "import('./demo.js')"
```

### Test Backend API

```bash
# Terminal 3 - while backend is running

# Health check
curl http://localhost:5000/health

# Test emotion analysis (empty, just testing endpoint)
curl -X POST http://localhost:5000/api/emotion/analyze \
  -H "Content-Type: application/json" \
  -d '{"audio_base64": ""}'

# Test intent recognition
curl -X POST http://localhost:5000/api/nlu/intent \
  -H "Content-Type: application/json" \
  -d '{"text": "the answer is five"}'

# Test IRT statistics
curl http://localhost:5000/api/irt/statistics/test_student
```

### Test Frontend + Backend Integration

**Browser DevTools Console (F12):**
```javascript
// Fetch from backend
fetch('http://localhost:5000/api/nlu/intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'five' })
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## Part 5: Detailed Dependency Installation

### Option A: Quick Install (Recommended)

```bash
# Frontend (1 min)
npm install

# Backend (3-5 min)
pip install -r requirements.txt
```

### Option B: Manual Installation

**Frontend Packages:**
```bash
npm install --save-dev @types/node
npm install --save jest
npm install --save-dev nodemon
```

**Backend Core:**
```bash
pip install numpy scipy scikit-learn pandas librosa soundfile flask flask-cors python-dotenv
```

**Backend Optional (Deep Learning):**
```bash
pip install tensorflow keras torch torchaudio  # Large downloads ~2GB
```

**Backend Optional (NLP):**
```bash
pip install transformers spacy nltk textblob
python -m spacy download en_core_web_sm
```

### Option C: Troubleshooting Installation

**Problem: `pip install` fails**
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install specific version
pip install numpy==1.21.0

# Install from requirements with verbose output
pip install -r requirements.txt -v
```

**Problem: `npm install` fails**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install --verbose
```

**Problem: Virtual environment not activating**
```bash
# Windows - try full path
C:\RP-2025\voice-learning-module\ml-backend\venv\Scripts\activate

# macOS/Linux
/path/to/venv/bin/activate
```

---

## Part 6: Project Structure & Key Files

```
voice-learning-module/
├── package.json                    # Frontend config
├── src/
│   ├── index.js                   # Frontend entry point
│   ├── core/
│   │   └── voice-learning-module.js
│   ├── audio/
│   │   ├── speech-recognizer.js
│   │   ├── text-to-speech.js
│   │   └── audio-processor.js
│   ├── emotion-detection/
│   │   └── emotion-detector.js
│   ├── adaptive-engine/
│   │   └── adaptive-difficulty-engine.js
│   ├── gamification/
│   │   ├── gamification-engine.js
│   │   ├── badges.js
│   │   ├── progress-tracker.js
│   │   ├── leaderboard.js
│   │   └── demo.js
│   └── activities/
│       └── counting-adventure.js
│
└── ml-backend/
    ├── app.py                     # Backend entry point
    ├── requirements.txt           # Python dependencies
    ├── setup.py
    ├── .env.example
    ├── examples.py
    ├── README.md
    └── src/
        ├── audio/
        ├── emotion/
        ├── nlu/
        ├── models/
        └── api/
```

---

## Part 7: Quick Reference Commands

### Frontend Commands
```bash
cd e:\RP-2025\voice-learning-module

npm install              # Install dependencies (first time)
npm start               # Run frontend
npm run dev             # Run with auto-reload
npm test                # Run tests
npm list                # Check installed packages
```

### Backend Commands
```bash
cd e:\RP-2025\voice-learning-module\ml-backend

python -m venv venv                    # Create virtual environment
venv\Scripts\activate                  # Activate (Windows)
source venv/bin/activate               # Activate (macOS/Linux)
pip install -r requirements.txt        # Install dependencies
python app.py                          # Run backend
python -m pytest tests/                # Run tests
python examples.py                     # Run examples
pip list                               # Check installed packages
```

### Testing Commands
```bash
# Frontend gamification test
node --input-type=module --eval "import('./src/gamification/demo.js')"

# Backend health check
curl http://localhost:5000/health

# Full integration test
# 1. Start backend (Terminal 2)
# 2. Open test.html in browser (Terminal 1)
# 3. Check browser console (F12)
```

---

## Part 8: Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm: command not found` | Install Node.js from https://nodejs.org/ |
| `python: command not found` | Install Python from https://www.python.org/ |
| `venv activation fails` | Try full path: `C:\...\venv\Scripts\activate` |
| `pip install fails` | Run `python -m pip install --upgrade pip` first |
| `CORS errors in browser` | Backend must be running on port 5000 |
| `Port 5000 already in use` | Kill process: `netstat -ano \| findstr :5000` (Windows) |
| `localStorage not working` | Must run in browser, not Node.js |

---

## Part 9: Verification Checklist

After setup, verify everything works:

```bash
# ✓ Frontend installed
npm list | head -5

# ✓ Backend installed  
pip list | grep -E "flask|librosa|numpy"

# ✓ Frontend runs
npm start  # Should not error

# ✓ Backend runs (in new terminal)
python app.py  # Should say "Running on http://0.0.0.0:5000"

# ✓ Backend is responsive (in another terminal)
curl http://localhost:5000/health  # Should return JSON

# ✓ Gamification works
node --input-type=module --eval "import('./src/gamification/demo.js')"  # Should show output

# ✓ All green? You're ready!
```

---

## Part 10: Next Steps

1. **Start both servers** (Terminal 1 & 2)
2. **Open test.html** in browser
3. **Open DevTools** (F12)
4. **Test in console:**
   ```javascript
   gamification.rewardForActivity('test', {correct: true, timeTaken: 3, difficulty: 0.5});
   gamification.getPlayer('test');
   ```

5. **Create an activity** or integrate with voice recognition
6. **Deploy** when ready

---

## Support

- See `GAMIFICATION_GUIDE.md` for gamification details
- See `ml-backend/README.md` for API documentation
- See `docs/QUICK_START.md` for frontend overview
- Check `ml-backend/examples.py` for backend examples

---

**Status**: ✅ Ready to run! Follow Part 3 to start the system.
