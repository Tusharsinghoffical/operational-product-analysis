from fastapi import APIRouter, UploadFile, Depends, HTTPException
import pandas as pd
from sqlalchemy.orm import Session
from app.ml.anomaly_detector import detect_anomalies
from app.services.insight_engine import generate_insights
from app.database.db import get_user_db_session
from app.models.alert_model import Alert
from app.utils.auth import get_current_user
from app.models.user_model import User
from app.services.realtime import realtime_manager

router = APIRouter()

@router.post("/upload/sales")
async def upload_sales(
    file: UploadFile,
    current_user: User = Depends(get_current_user)
):
    if not file.filename or not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files supported")
    
    try:
        df = pd.read_csv(file.file)
        if df.empty:
            raise HTTPException(status_code=400, detail="Empty file")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV: {str(e)}")
    
    # Get user's personal database
    db = get_user_db_session(current_user.id)
    
    try:
        df = detect_anomalies(df)
        insights = generate_insights(df)

        for insight in insights:
            alert = Alert(
                user_id=current_user.id,
                message=insight["message"],
                severity=insight["severity"]
            )
            db.add(alert)
        db.commit()

        await realtime_manager.broadcast_user_event(
            current_user.id,
            "insights.updated",
            {"count": len(insights)},
        )

        return {
            "message": "File processed and insights saved",
            "insights": insights
        }
    finally:
        db.close()
