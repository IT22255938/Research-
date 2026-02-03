# Quick Start - One Page Cheat Sheet

## Prerequisites
- **Node.js v16+** - [Download](https://nodejs.org/)
- **Python 3.8+** - [Download](https://www.python.org/)
- **Project location**: `e:\RP-2025\voice-learning-module`

Verify:
```bash
node --version
python --version
```

---

## Installation (First Time Only)

### Frontend Setup (5 min)
```bash
cd e:\RP-2025\voice-learning-module
npm install
```

### Backend Setup (10 min)
```bash
cd e:\RP-2025\voice-learning-module\ml-backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## Running the Project

### Option 1: Backend Only (Audio ML Services)

**Terminal 1:**
```bash
cd e:\RP-2025\voice-learning-module\ml-backend
venv\Scripts\activate
python app.py
```

Opens: `http://localhost:5000`

Test:
```bash
# New terminal
curl http://localhost:5000/health
```

---

### Option 2: Frontend Only (Voice Learning Standalone)

**Terminal 1:**
```bash
cd e:\RP-2025\voice-learning-module
npm start
```

Test in browser:
```html
<script type="module">
  import VoiceLearningModule from './src/core/voice-learning-module.js';
  import GamificationEngine from './src/gamification/gamification-engine.js';
  
  window.vlm = new VoiceLearningModule();
  window.gamification = new GamificationEngine({ autoSave: true });
  
  console.log('✓ Ready!');
</script>
```

---

### Option 3: Full Stack (Frontend + Backend)

**Terminal 1 - Frontend:**
```bash
cd e:\RP-2025\voice-learning-module
npm start
```

**Terminal 2 - Backend:**
```bash
cd e:\RP-2025\voice-learning-module\ml-backend
venv\Scripts\activate
python app.py
```

Both running = Full system ready!

---

## Quick Tests

### Test Gamification (No servers needed)
```bash
cd e:\RP-2025\voice-learning-module\src\gamification
node --input-type=module --eval "import('./demo.js')"
```

### Test Backend APIs (Backend must be running)
```bash
# Check status
curl http://localhost:5000/health

# Test intent recognition
curl -X POST http://localhost:5000/api/nlu/intent \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"five\"}"

# Test IRT
curl http://localhost:5000/api/irt/statistics/student_1
```

---

## Dependencies Summary

### Frontend (JavaScript)
- No external packages required for basic operation
- Optional: Jest (testing), Nodemon (dev reload)

### Backend (Python)
- **Core**: numpy, scipy, scikit-learn, pandas
- **Audio**: librosa, soundfile
- **Web**: flask, flask-cors
- **ML** (optional): tensorflow, torch, transformers

Total size: ~500MB with optional deep learning packages

---

## File Locations

```
Frontend code:     e:\RP-2025\voice-learning-module\src\
Frontend start:    e:\RP-2025\voice-learning-module\src\index.js
Gamification:      e:\RP-2025\voice-learning-module\src\gamification\
Activities:        e:\RP-2025\voice-learning-module\src\activities\

Backend code:      e:\RP-2025\voice-learning-module\ml-backend\
Backend start:     e:\RP-2025\voice-learning-module\ml-backend\app.py
ML modules:        e:\RP-2025\voice-learning-module\ml-backend\src\
```

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `npm not found` | Install Node.js |
| `python not found` | Install Python |
| `venv not activating` | Use full path: `C:\...\venv\Scripts\activate.bat` |
| `pip install fails` | Run `python -m pip install --upgrade pip` first |
| `Port 5000 in use` | Backend already running, or kill: `netstat -ano \| findstr :5000` |
| `CORS errors` | Start backend on port 5000 before frontend |

---

## Next Steps

1. ✅ Install Node.js and Python
2. ✅ Run `npm install` (frontend)
3. ✅ Create venv and run `pip install -r requirements.txt` (backend)
4. ✅ Start backend: `python app.py`
5. ✅ Start frontend: `npm start`
6. ✅ Test gamification: `node --input-type=module --eval "import('./src/gamification/demo.js')"`
7. 🚀 Build activities and integrate!

---

## Need Help?

- Full setup guide: See `SETUP_AND_RUN.md`
- Gamification docs: See `GAMIFICATION_GUIDE.md`
- Backend API: See `ml-backend/README.md`
- Frontend overview: See `docs/QUICK_START.md`

---

**Ready?** Start with your terminal choice above! ✅
