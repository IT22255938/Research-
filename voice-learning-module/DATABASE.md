# Database Documentation

## Overview

The Voice Learning Module uses **SQLite** for persistent data storage. The database stores:
- Student profiles and metadata
- Learning sessions and activity logs
- Student responses and performance data
- Progress metrics (IRT scores, XP, levels)
- Earned badges and achievements
- Analytics and research data

## Database Location

```
e:\RP-2025\voice-learning-module\ml-backend\data\voice_learning.db
```

## Tables

### 1. **students**
Stores student profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Unique student identifier |
| name | TEXT | Student's name |
| age | INTEGER | Student's age |
| special_needs | TEXT | Special needs category (e.g., Autism, Dyslexia) |
| language | TEXT | Preferred language (default: en-US) |
| created_at | TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | Last profile update |

### 2. **sessions**
Tracks learning sessions/activities.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Session ID |
| student_id | TEXT (FK) | Reference to student |
| activity_id | TEXT | Which activity (counting-adventure, etc) |
| start_time | TIMESTAMP | When session started |
| end_time | TIMESTAMP | When session ended |
| duration_seconds | INTEGER | Total session duration |
| status | TEXT | Status (in_progress, completed, abandoned) |

### 3. **responses**
Records individual student responses/answers.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Response ID |
| session_id | TEXT (FK) | Session this belongs to |
| student_id | TEXT (FK) | Student who responded |
| question_id | TEXT | Which question answered |
| response_text | TEXT | Text response |
| response_audio | BLOB | Audio response (binary) |
| correct | BOOLEAN | Whether answer was correct |
| confidence | REAL | Confidence score (0-1) |
| emotion_state | TEXT | Emotion during response (engaged, frustrated, etc) |
| timestamp | TIMESTAMP | When response was given |

### 4. **progress**
Stores IRT model scores and learning progression.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Progress record ID |
| student_id | TEXT (FK) | Student reference |
| activity_id | TEXT | Activity being tracked |
| ability | REAL | Current ability estimate (θ) |
| standard_error | REAL | Measurement error |
| accuracy | REAL | Answer accuracy percentage |
| attempts | INTEGER | Total attempts in activity |
| correct_count | INTEGER | Correct responses |
| xp_earned | INTEGER | Total XP earned |
| level | INTEGER | Current level (1-10) |
| last_updated | TIMESTAMP | Last update time |

### 5. **badges**
Tracks earned achievements/badges.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Badge award ID |
| student_id | TEXT (FK) | Student who earned it |
| badge_type | TEXT | Badge category (starter, streak_3, accuracy_90, etc) |
| badge_name | TEXT | Display name |
| earned_at | TIMESTAMP | When earned |

### 6. **analytics**
Stores custom metrics and analytics data.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Metric record ID |
| student_id | TEXT (FK) | Student |
| metric_name | TEXT | Name of metric |
| metric_value | REAL | Value |
| recorded_at | TIMESTAMP | When recorded |

## API Endpoints

### Student Management

**Create Student**
```
POST /api/db/students
Content-Type: application/json

{
  "name": "Emma",
  "age": 8,
  "special_needs": "Autism",
  "language": "en-US"
}

Response: 201 Created
{
  "student_id": "abc123...",
  "status": "created"
}
```

**Get Student**
```
GET /api/db/students/<student_id>

Response: 200 OK
{
  "id": "abc123",
  "name": "Emma",
  "age": 8,
  "special_needs": "Autism"
}
```

**Get Statistics**
```
GET /api/db/students/<student_id>/stats

Response: 200 OK
{
  "student_id": "abc123",
  "total_sessions": 5,
  "total_responses": 45,
  "accuracy": 82.5,
  "total_xp": 250
}
```

**Export Student Data** (for research)
```
GET /api/db/students/<student_id>/export

Response: 200 OK
{
  "student": {...},
  "sessions": [...],
  "responses": [...],
  "progress": [...],
  "badges": [...],
  "exported_at": "2025-12-03T..."
}
```

### Session Management

**Create Session**
```
POST /api/db/sessions
Content-Type: application/json

{
  "student_id": "abc123",
  "activity_id": "counting-adventure"
}

Response: 201 Created
{
  "session_id": "xyz789...",
  "status": "created"
}
```

**End Session**
```
POST /api/db/sessions/<session_id>/end

Response: 200 OK
{
  "status": "ended"
}
```

### Response Recording

**Record Response**
```
POST /api/db/responses
Content-Type: application/json

{
  "session_id": "xyz789",
  "student_id": "abc123",
  "question_id": "q_1",
  "response_text": "five",
  "correct": true,
  "confidence": 0.95,
  "emotion_state": "engaged"
}

Response: 201 Created
{
  "response_id": "resp123...",
  "status": "recorded"
}
```

### Progress Tracking

**Get Progress**
```
GET /api/db/progress/<student_id>/<activity_id>

Response: 200 OK
{
  "id": "prog123",
  "student_id": "abc123",
  "activity_id": "counting-adventure",
  "ability": 0.5,
  "standard_error": 0.4,
  "accuracy": 0.82,
  "attempts": 15,
  "correct_count": 12,
  "xp_earned": 150,
  "level": 3,
  "last_updated": "2025-12-03T..."
}
```

**Update Progress**
```
POST /api/db/progress
Content-Type: application/json

{
  "student_id": "abc123",
  "activity_id": "counting-adventure",
  "ability": 0.6,
  "standard_error": 0.38,
  "accuracy": 0.85,
  "attempts": 16,
  "correct_count": 13,
  "xp_earned": 160,
  "level": 3
}

Response: 200 OK
{
  "status": "updated"
}
```

### Badges

**Award Badge**
```
POST /api/db/badges
Content-Type: application/json

{
  "student_id": "abc123",
  "badge_type": "accuracy_90",
  "badge_name": "Accuracy Ace"
}

Response: 201 Created
{
  "badge_id": "badge123...",
  "status": "awarded"
}
```

**Get Badges**
```
GET /api/db/badges/<student_id>

Response: 200 OK
{
  "badges": [
    {
      "id": "badge123",
      "student_id": "abc123",
      "badge_type": "starter",
      "badge_name": "Starter Badge",
      "earned_at": "2025-12-03T..."
    },
    ...
  ]
}
```

### Health Check

```
GET /api/db/health

Response: 200 OK
{
  "status": "operational",
  "database": "connected"
}
```

## Usage Examples

### JavaScript/Frontend

```javascript
// Create a student
async function createStudent(name, age, specialNeeds) {
  const response = await fetch('http://localhost:5000/api/db/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, age, special_needs: specialNeeds })
  });
  const data = await response.json();
  return data.student_id;
}

// Start a session
async function startSession(studentId, activityId) {
  const response = await fetch('http://localhost:5000/api/db/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, activity_id: activityId })
  });
  const data = await response.json();
  return data.session_id;
}

// Record a response
async function recordResponse(sessionId, studentId, questionId, responseText, correct) {
  await fetch('http://localhost:5000/api/db/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      student_id: studentId,
      question_id: questionId,
      response_text: responseText,
      correct: correct,
      confidence: 0.85,
      emotion_state: 'engaged'
    })
  });
}

// Get student stats
async function getStats(studentId) {
  const response = await fetch(`http://localhost:5000/api/db/students/${studentId}/stats`);
  return await response.json();
}
```

## Sample Data

The database is initialized with sample students:
- **Emma** (Age 8, Autism Spectrum Disorder)
- **Lucas** (Age 7, Dyslexia)
- **Sophia** (Age 9, ADHD)

Run `setup_db.py` to initialize and populate with sample data.

## Data Export for Research

Export all student data for research analysis:

```python
from src.database import Database

db = Database()
data = db.export_student_data('student_id')

# Returns dict with:
# - student: profile info
# - sessions: all learning sessions
# - responses: all answers/responses
# - progress: IRT scores over time
# - badges: achievements earned
# - exported_at: timestamp
```

Export can be used for:
- Learning analytics
- Research studies
- Performance analysis
- Progress reports to caregivers

## Backup & Maintenance

### Backup Database
```powershell
Copy-Item data/voice_learning.db data/voice_learning.db.backup
```

### Reset Database
```python
from src.database import Database
db = Database()  # Deletes old, creates fresh
```

## Performance Notes

- Uses SQLite (suitable for single-server deployments)
- Indexed on student_id and session_id for fast queries
- For large-scale deployments, consider PostgreSQL
- Data is persisted to disk automatically after each operation

## Security Considerations

- No authentication/authorization in current implementation
- Consider adding user authentication before production
- Sanitize all inputs (especially response_text)
- Implement data encryption for sensitive fields
- Regular backups recommended
