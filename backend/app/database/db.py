from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from pathlib import Path

# Base directory for all user databases
DB_DIR = Path(__file__).parent.parent.parent / "user_databases"
DB_DIR.mkdir(exist_ok=True)

# Shared database for users table (authentication)
SHARED_DB_URL = f"sqlite:///{DB_DIR / 'users.db'}"

# Create shared engine for users
shared_engine = create_engine(SHARED_DB_URL, connect_args={"check_same_thread": False})
SharedSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=shared_engine)

Base = declarative_base()


def get_user_db_path(user_id: int) -> str:
    """Get the database file path for a specific user"""
    return f"sqlite:///{DB_DIR / f'user_{user_id}.db'}"


def get_user_engine(user_id: int):
    """Create a database engine for a specific user"""
    user_db_path = get_user_db_path(user_id)
    return create_engine(user_db_path, connect_args={"check_same_thread": False})


def get_user_db_session(user_id: int):
    """Create a database session for a specific user"""
    user_engine = get_user_engine(user_id)
    UserSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=user_engine)
    return UserSessionLocal()


def get_shared_db():
    """Get shared database session (for users table)"""
    db = SharedSessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_user_database(user_id: int):
    """Create a new database for a user"""
    from app.models.user_model import Base as UserModel
    from app.models.alert_model import Base as AlertModel
    
    user_engine = get_user_engine(user_id)
    
    # Create all tables in user's database
    Base.metadata.create_all(bind=user_engine)
    
    return True


def init_shared_database():
    """Initialize the shared database (users table only)"""
    from app.models.user_model import Base as UserModel
    
    # Create users table in shared database
    Base.metadata.create_all(bind=shared_engine)
    
    return True


def get_db():
    """Legacy support - uses shared database"""
    db = SharedSessionLocal()
    try: 
        yield db
    finally:
        db.close()
