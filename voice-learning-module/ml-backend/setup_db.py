#!/usr/bin/env python3
"""
Database Setup and Test Script
Initializes the database and creates sample data
"""

import sys
sys.path.insert(0, '/e/RP-2025/voice-learning-module/ml-backend')

from src.database import Database
import uuid

def main():
    print("\n" + "="*60)
    print("Voice Learning Module - Database Setup")
    print("="*60 + "\n")
    
        # Initialize MongoDB connection
        print("✓ Connecting to MongoDB Atlas...")
    db = Database()
    
    # Create sample students
    print("✓ Creating sample students...")
    students = [
        {
            'id': str(uuid.uuid4()),
            'name': 'Emma',
            'age': 8,
            'special_needs': 'Autism Spectrum Disorder'
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Lucas',
            'age': 7,
            'special_needs': 'Dyslexia'
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Sophia',
            'age': 9,
            'special_needs': 'ADHD'
        }
    ]
    
    for student in students:
        success = db.create_student(
            student_id=student['id'],
            name=student['name'],
            age=student['age'],
            special_needs=student['special_needs']
        )
        status = "✓" if success else "✗"
        print(f"  {status} {student['name']} (ID: {student['id'][:8]}...)")
    
    # Create sample session for first student
    print("\n✓ Creating sample learning session...")
    session_id = str(uuid.uuid4())
    db.create_session(
        session_id=session_id,
        student_id=students[0]['id'],
        activity_id='counting-adventure'
    )
    print(f"  ✓ Session created (ID: {session_id[:8]}...)")
    
    # Record sample responses
    print("\n✓ Recording sample responses...")
    for i in range(3):
        response_id = str(uuid.uuid4())
        db.record_response(
            response_id=response_id,
            session_id=session_id,
            student_id=students[0]['id'],
            question_id=f'q_{i+1}',
            response_text=f'answer_{i+1}',
            correct=i < 2,  # First 2 correct
            confidence=0.85 + (i * 0.05),
            emotion_state='engaged'
        )
        print(f"  ✓ Response {i+1} recorded")
    
    # Update progress
    print("\n✓ Updating student progress...")
    db.update_progress(
        student_id=students[0]['id'],
        activity_id='counting-adventure',
        ability=0.5,
        standard_error=0.4,
        accuracy=0.67,
        attempts=3,
        correct_count=2,
        xp_earned=50,
        level=2
    )
    print(f"  ✓ Progress updated for {students[0]['name']}")
    
    # Award badges
    print("\n✓ Awarding badges...")
    badges = [
        ('starter', 'Starter Badge', 'First step into learning'),
        ('streak_3', '3-Day Streak', 'Learned 3 days in a row'),
        ('accuracy_90', 'Accuracy Ace', '90% accuracy achieved')
    ]
    
    for badge_type, badge_name, _ in badges:
        badge_id = str(uuid.uuid4())
        db.award_badge(
            badge_id=badge_id,
            student_id=students[0]['id'],
            badge_type=badge_type,
            badge_name=badge_name
        )
        print(f"  ✓ {badge_name}")
    
    # Display statistics
    print("\n" + "="*60)
    print("STUDENT STATISTICS")
    print("="*60)
    for student in students:
        stats = db.get_session_stats(student['id'])
        print(f"\n{student['name']}:")
        print(f"  Sessions: {stats['total_sessions']}")
        print(f"  Responses: {stats['total_responses']}")
        print(f"  Accuracy: {stats['accuracy']}%")
        print(f"  Total XP: {stats['total_xp']}")
    
    # Display badges for first student
    print(f"\n\nBadges earned by {students[0]['name']}:")
    badges = db.get_badges(students[0]['id'])
    for badge in badges:
        print(f"  ⭐ {badge['badge_name']}")
    
    print("\n" + "="*60)
        print("✓ MongoDB Atlas setup complete!")
        print(f"✓ Using URI: {db.uri}")
        print(f"✓ Database: {db.db_name}")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()
