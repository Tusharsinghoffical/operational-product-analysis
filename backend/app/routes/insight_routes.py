from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_user_db_session
from app.models.alert_model import Alert
from app.utils.auth import get_current_user
from app.models.user_model import User

router = APIRouter()

@router.get("/insights")
def get_insights(current_user: User = Depends(get_current_user)):
    # Get user's personal database
    db = get_user_db_session(current_user.id)
    
    try:
        alerts = db.query(Alert).filter(
            Alert.user_id == current_user.id
        ).order_by(Alert.timestamp.desc()).all()
        return alerts
    finally:
        db.close()
        