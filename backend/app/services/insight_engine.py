"""
Insight Engine - Uses Groq AI for generating business insights
"""
import json
from app.services.groq_ai_service import generate_business_insights


def generate_insights(df):
    """
    Generate AI-powered insights from uploaded data
    
    Args:
        df: Pandas DataFrame with business data
    
    Returns:
        List of insight dictionaries
    """
    insights = []

    # Basic anomaly insight
    if "anomaly" in df.columns:
        anomalies = df[df["anomaly"] == -1]
        if not anomalies.empty:
            insights.append({
                "message": f"{len(anomalies)} unusual operational patterns detected in data.",
                "severity": "high",
                "timestamp": ""
            })

    try:
        # Prepare data summary for Groq
        data_summary = {
            "statistics": df.describe().to_dict(),
            "columns": list(df.columns),
            "shape": df.shape,
            "sample_data": df.head(10).to_dict(orient='records'),
            "data_types": df.dtypes.astype(str).to_dict()
        }
        
        # Use Groq AI to generate insights
        ai_insights = generate_business_insights(data_summary)
        
        for ins in ai_insights:
            insights.append({
                "message": ins["message"],
                "severity": ins["severity"].lower(),
                "timestamp": ins.get("timestamp", "")
            })
            
    except Exception as e:
        print(f"Error generating AI insights with Groq: {e}")
        # Fallback insights
        if "quantity" in df.columns:
            avg_sales = df["quantity"].mean()
            if avg_sales < 10:
                insights.append({
                    "message": "Sales seem lower than expected",
                    "severity": "medium",
                    "timestamp": ""
                })
            elif avg_sales > 50:
                insights.append({
                    "message": "High sales volume observed",
                    "severity": "low",
                    "timestamp": ""
                })

    return insights