"""
Migration script to create user databases for existing users
Run this once after updating to the new multi-database system
"""
import sys
import os
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

from app.database.db import get_shared_db, get_user_db_session, create_user_database, init_shared_database
from app.models.user_model import User

def migrate_existing_users():
    """Create databases for all existing users"""
    
    print("=" * 60)
    print("OpSense Database Migration")
    print("=" * 60)
    
    # Initialize shared database
    print("\n1. Initializing shared database (users table)...")
    init_shared_database()
    print("✅ Shared database initialized")
    
    # Get all existing users
    print("\n2. Fetching existing users...")
    db = next(get_shared_db())
    
    try:
        users = db.query(User).all()
        print(f"✅ Found {len(users)} existing users")
        
        if len(users) == 0:
            print("\n⚠️  No existing users found. Skipping migration.")
            return
        
        # Create database for each user
        print("\n3. Creating personal databases for each user...")
        for user in users:
            try:
                create_user_database(user.id)
                print(f"   ✅ User {user.id} ({user.email}) - Database created")
            except Exception as e:
                print(f"   ❌ User {user.id} ({user.email}) - Failed: {e}")
        
        print("\n" + "=" * 60)
        print("✅ Migration completed successfully!")
        print("=" * 60)
        print(f"\nSummary:")
        print(f"  - Total users: {len(users)}")
        print(f"  - Shared DB: user_databases/users.db")
        print(f"  - User DBs: user_databases/user_<id>.db")
        
    finally:
        db.close()

if __name__ == "__main__":
    try:
        migrate_existing_users()
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
