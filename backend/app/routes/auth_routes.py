"""
Authentication API routes
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_shared_db, create_user_database
from app.models.auth_schemas import UserCreate, UserLogin, UserResponse, Token
from app.controllers import auth_controller
from app.utils.auth import get_current_user
from app.models.user_model import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=Token)
async def signup(user_data: UserCreate, db: Session = Depends(get_shared_db)):
    """
    Register a new user account
    
    - **name**: User's full name
    - **email**: Valid email address (unique)
    - **password**: Minimum 8 characters with uppercase, lowercase, and digit
    """
    return auth_controller.signup(user_data, db)


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_shared_db)):
    """
    Authenticate user and return JWT token
    
    - **email**: User's email address
    - **password**: User's password
    """
    return auth_controller.login(user_data, db)


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user's profile
    
    Requires valid JWT token in Authorization header.
    """
    return auth_controller.get_user_profile(current_user)
