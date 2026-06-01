"""
Database Viewer for OpSense
Quick script to view database contents
"""
import sqlite3
import os

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), 'opsense.db')

def view_database():
    """View all tables and their contents"""
    
    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found at: {DB_PATH}")
        return
    
    print(f"✅ Database found at: {DB_PATH}\n")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    print(f"📊 Found {len(tables)} tables:\n")
    print("=" * 60)
    
    for table in tables:
        table_name = table[0]
        print(f"\n📋 Table: {table_name}")
        print("-" * 60)
        
        # Get column names
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        print(f"Columns: {[col[1] for col in columns]}")
        
        # Get row count
        cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
        count = cursor.fetchone()[0]
        print(f"Total rows: {count}")
        
        # Show first 5 rows
        print(f"\nSample data (first 5 rows):")
        cursor.execute(f"SELECT * FROM {table_name} LIMIT 5;")
        rows = cursor.fetchall()
        
        for i, row in enumerate(rows, 1):
            print(f"\n  Row {i}:")
            for col, val in zip([c[1] for c in columns], row):
                print(f"    {col}: {val}")
        
        print("\n" + "=" * 60)
    
    conn.close()

def run_query(query):
    """Run a custom SQL query"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute(query)
        results = cursor.fetchall()
        
        print(f"✅ Query executed successfully!\n")
        print(f"Results ({len(results)} rows):\n")
        
        for row in results:
            print(row)
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    print("OpSense Database Viewer")
    print("=" * 60)
    
    view_database()
