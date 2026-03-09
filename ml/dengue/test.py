import pandas as pd
import joblib
import json
import numpy as np
from sklearn.metrics import r2_score

# -----------------------------
# Load dataset
# -----------------------------
df = pd.read_csv("synthetic_chennai_dengue_dataset.csv")

# -----------------------------
# Encode zone (use saved encoder)
# -----------------------------
encoder = joblib.load("zone_encoder.pkl")
try:
    df["zone_encoded"] = encoder.transform(df["zone_name"]) 
except Exception:
    # fallback: fit on current data
    from sklearn.preprocessing import LabelEncoder
    le = LabelEncoder()
    df["zone_encoded"] = le.fit_transform(df["zone_name"])

# -----------------------------
# Features used during training
# -----------------------------
features = [
    "year",
    "month",
    "zone_id",
    "zone_encoded",
    "rainfall_mm",
    "temperature_c",
    "humidity_percent",
    "mosquito_index",
    "prev_month_cases_log"
]


# compute prev_month_cases_log consistent with training metadata if available
pm_cap = None
try:
    with open("model_metadata.json", "r") as fh:
        meta = json.load(fh)
        pm_cap = meta.get("caps", {}).get("prev_month_cases")
except Exception:
    pm_cap = None

if pm_cap is None:
    pm_cap = float(df["prev_month_cases"].quantile(0.99))

df["prev_month_cases_clipped"] = np.clip(df["prev_month_cases"], 0.0, pm_cap)
df["prev_month_cases_log"] = np.log1p(df["prev_month_cases_clipped"])

X = df[features]
y = df["cases"]

# -----------------------------
# Load trained model
# -----------------------------
model = joblib.load("dengue_prediction_model.pkl")

# -----------------------------
# Predictions
# -----------------------------
predictions = model.predict(X)

# -----------------------------
# R2 Score
# -----------------------------
r2 = r2_score(y, predictions)

print("R2 Score:", r2)