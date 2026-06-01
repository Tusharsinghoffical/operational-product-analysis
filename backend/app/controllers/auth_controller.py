"""
Authentication controller handling user registration and login logic
"""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.models.auth_schemas import UserCreate, UserLogin, UserResponse, Token
from app.utils.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
)
from app.database.db import create_user_database


def signup(user_data: UserCreate, db: Session) -> Token:
    """
    Register a new user
    
    Args:
        user_data: User registration data
        db: Database session
    
    Returns:
        JWT token and user information
    
    Raises:
        HTTPException: If email already exists
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create new user with hashed password
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create user's personal database
    try:
        create_user_database(new_user.id)
    except Exception as e:
        # Log error but don't fail signup
        print(f"Warning: Failed to create user database: {e}")
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(new_user.id)}
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.from_orm(new_user),
    )


def login(user_data: UserLogin, db: Session) -> Token:
    """
    Authenticate user and return JWT token
    
    Args:
        user_data: User login credentials
        db: Database session
    
    Returns:
        JWT token and user information
    
    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id)}
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.from_orm(user),
    )


def get_user_profile(user: User) -> UserResponse:
    """
    Get current user's profile
    
    Args:
        user: Current authenticated user
    
    Returns:
        User profile information
    """
    return UserResponse.from_orm(user)
