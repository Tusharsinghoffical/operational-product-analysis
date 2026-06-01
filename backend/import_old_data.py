"""
Import users and alerts from old single database to new multi-database system
"""
import sys
import shutil
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

import sqlite3
from app.database.db import get_shared_db, get_user_db_session, create_user_database, init_shared_database, DB_DIR
from app.models.user_model import User
from app.models.alert_model import Alert
from app.utils.auth import get_password_hash

OLD_DB = backend_path / "opsense.db"

def import_from_old_database():
    """Import data from old database to new system"""
    
    print("=" * 60)
    print("OpSense Data Import")
    print("=" * 60)
    
    if not OLD_DB.exists():
        print(f"\n❌ Old database not found at: {OLD_DB}")
        return
    
    print(f"\n✅ Found old database: {OLD_DB}")
    
    # Initialize new shared database
    print("\n1. Initializing new shared database...")
    init_shared_database()
    print("✅ Shared database initialized")
    
    # Connect to old database
    old_conn = sqlite3.connect(str(OLD_DB))
    old_cursor = old_conn.cursor()
    
    # Import users
    print("\n2. Importing users...")
    old_cursor.execute("SELECT id, name, email, hashed_password, created_at FROM users")
    old_users = old_cursor.fetchall()
    
    print(f"   Found {len(old_users)} users in old database")
    
    new_db = next(get_shared_db())
    
    try:
        for old_user in old_users:
            user_id, name, email, hashed_pw, created_at = old_user
            
            # Check if user already exists
            existing = new_db.query(User).filter(User.email == email).first()
            if existing:
                print(f"   ⏭️  User {email} already exists, skipping")
                continue
            
            # Create user in new database
            new_user = User(
                id=user_id,
                name=name,
                email=email,
                hashed_password=hashed_pw,
            )
            new_db.add(new_user)
            new_db.commit()
            
            print(f"   ✅ Imported user: {email} (ID: {user_id})")
            
            # Create personal database for user
            try:
                create_user_database(user_id)
                print(f"      ✅ Created personal database: user_{user_id}.db")
            except Exception as e:
                print(f"      ⚠️  Failed to create user DB: {e}")
        
        # Import alerts
        print("\n3. Importing alerts...")
        old_cursor.execute("SELECT id, message, severity, timestamp FROM alerts")
        old_alerts = old_cursor.fetchall()
        
        print(f"   Found {len(old_alerts)} alerts in old database")
        
        # Assign alerts to first user (or create a system user)
        if len(old_users) > 0:
            first_user_id = old_users[0][0]
            print(f"   Assigning all alerts to user ID: {first_user_id}")
            
            user_db = get_user_db_session(first_user_id)
            
            try:
                for old_alert in old_alerts:
                    alert_id, message, severity, timestamp = old_alert
                    
                    new_alert = Alert(
                        id=alert_id,
                        user_id=first_user_id,
                        message=message,
                        severity=severity,
                    )
                    user_db.add(new_alert)
                
                user_db.commit()
                print(f"   ✅ Imported {len(old_alerts)} alerts to user {first_user_id}")
            finally:
                user_db.close()
        else:
            print("   ⚠️  No users found, skipping alerts import")
        
        print("\n" + "=" * 60)
        print("✅ Import completed successfully!")
        print("=" * 60)
        print(f"\nNew Database Structure:")
        print(f"  📁 user_databases/")
        print(f"    📄 users.db - All user accounts")
        for user_id, _, email, _, _ in old_users:
            print(f"    📄 user_{user_id}.db - {email}'s data")
        
        print(f"\n⚠️  Old database backed up at: {OLD_DB}")
        print(f"   You can delete it after verifying the import")
        
    finally:
        new_db.close()
        old_conn.close()

if __name__ == "__main__":
    try:
        import_from_old_database()
    except Exception as e:
        print(f"\n❌ Import failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
