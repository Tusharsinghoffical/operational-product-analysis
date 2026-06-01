import sqlite3
import sys

# Connect to database
conn = sqlite3.connect('opsense.db')
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables in database:")
for table in tables:
    print(f"  - {table[0]}")

# Check users table structure
if any('user' in table[0].lower() for table in tables):
    print("\nUsers table structure:")
    cursor.execute("PRAGMA table_info(users);")
    columns = cursor.fetchall()
    for col in columns:
        print(f"  {col[1]} ({col[2]})")
    
    # Count users
    cursor.execute("SELECT COUNT(*) FROM users;")
    count = cursor.fetchone()[0]
    print(f"\nTotal users: {count}")
    
    # List all users
    if count > 0:
        print("\nExisting users:")
        cursor.execute("SELECT id, name, email, created_at FROM users;")
        users = cursor.fetchall()
        for user in users:
            print(f"  ID: {user[0]}, Name: {user[1]}, Email: {user[2]}, Created: {user[3]}")

conn.close()
