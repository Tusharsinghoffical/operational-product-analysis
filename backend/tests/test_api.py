import pandas as pd

from app.ml.anomaly_detector import detect_anomalies
from app.services.insight_engine import generate_insights
from fastapi.testclient import TestClient
from app.main import app
import os

def test_anomaly_detector_and_insights():
    data = {
        "quantity": [5, 10, 5, 5, 500, 5, 6, 5, 7, 5, 5, 6, 5], 
        "price": [10, 10, 10, 10, 1000, 10, 10, 10, 10, 10, 10, 10, 10]
    }
    df = pd.DataFrame(data)
    df_anomaly = detect_anomalies(df)
    
    assert "anomaly" in df_anomaly.columns
    
    insights = generate_insights(df_anomaly)
    
    assert type(insights) == list
    assert len(insights) > 0
    has_anomaly_insight = any("unusual operational patterns detected" in i["message"] for i in insights)
    assert has_anomaly_insight

from app.main import home
def test_api_health():
    response = home()
    assert response == {"message": "Opsense API running successfully"}

if __name__ == "__main__":
    test_anomaly_detector_and_insights()
    test_api_health()
    print("All tests passed successfully!")
