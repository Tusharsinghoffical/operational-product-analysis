from sklearn.ensemble import IsolationForest
import pandas as pd

def detect_anomalies(df):
    numeric_df = df.select_dtypes(include=['number'])
    if numeric_df.empty:
        df["anomaly"] = 1
        return df
    
    model = IsolationForest(contamination=0.05, random_state=42)
    model.fit(numeric_df)
    df["anomaly"] = model.predict(numeric_df)
    return df
