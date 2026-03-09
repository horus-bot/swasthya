import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import LabelEncoder
import joblib
import json
from scipy.stats import randint
import warnings
warnings.filterwarnings("ignore")

# -----------------------------
# Load dataset
# -----------------------------
df = pd.read_csv("synthetic_chennai_typhoid_dataset.csv")

print("Dataset shape:", df.shape)

# -----------------------------
# Encode zone_name
# -----------------------------
le = LabelEncoder()
df["zone_encoded"] = le.fit_transform(df["zone_name"])

# Cap extreme prev_month_cases at the 99th percentile and create a log feature
pm_cap = float(df["prev_month_cases"].quantile(0.99))
df["prev_month_cases_clipped"] = np.clip(df["prev_month_cases"], 0.0, pm_cap)
# Typhoid cases don't hit 0 often, but just in case
df["prev_month_cases_log"] = np.log1p(df["prev_month_cases_clipped"])

# -----------------------------
# Feature selection
# -----------------------------
features = [
    "year",
    "month",
    "zone_id",
    "zone_encoded",
    "rainfall_mm",
    "temperature_c",
    "water_quality_index",
    "food_hygiene_index",
    "prev_month_cases_log"
]

X = df[features]
y = df["cases"]

# Save simple metadata (feature ranges) so the prediction pipeline can clip inputs
ranges = {}
for c in [
    "rainfall_mm",
    "temperature_c",
    "water_quality_index",
    "food_hygiene_index",
    "prev_month_cases",
    "cases",
]:
    if c in df.columns:
        ranges[c] = {"min": float(df[c].min()), "max": float(df[c].max()), "mean": float(df[c].mean())}

metadata = {"features": features, "ranges": ranges, "caps": {"prev_month_cases": pm_cap}}
with open("model_metadata.json", "w") as fh:
    json.dump(metadata, fh, indent=2)

# -----------------------------
# Train Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# -----------------------------
# Train Model
# -----------------------------
model = RandomForestRegressor(
    n_estimators=300,
    max_depth=12,
    random_state=42,
    n_jobs=-1
)

# Use a log1p transform on the target for stability
y_train_log = np.log1p(y_train)
y_test_log = np.log1p(y_test)

# Hyperparameter tuning with RandomizedSearchCV
param_dist = {
    "n_estimators": randint(100, 400),
    "max_depth": randint(5, 20),
    "max_features": ["sqrt", "log2", 0.5, 0.7, 1.0],
    "min_samples_leaf": randint(1, 4),
}

base = RandomForestRegressor(random_state=42, n_jobs=-1)
rs = RandomizedSearchCV(
    base,
    param_distributions=param_dist,
    n_iter=20,
    cv=4,
    scoring="neg_mean_absolute_error",
    random_state=42,
    n_jobs=-1,
    verbose=1,
)

rs.fit(X_train, y_train_log)

model = rs.best_estimator_
print("Best params:", rs.best_params_)

# -----------------------------
# Predictions
# -----------------------------
preds_log = model.predict(X_test)
preds = np.expm1(preds_log)

mae = mean_absolute_error(y_test, preds)
r2 = r2_score(y_test, preds)

print("\nModel Performance")
print("MAE:", mae)
print("R2 Score:", r2)

# -----------------------------
# Feature Importance
# -----------------------------
importance = pd.Series(
    model.feature_importances_,
    index=features
).sort_values(ascending=False)

print("\nFeature Importance")
print(importance)

# -----------------------------
# Save Model
# -----------------------------
joblib.dump(le, "zone_encoder_typhoid.pkl")
joblib.dump(model, "typhoid_prediction_model.pkl")

print("\nModel saved as typhoid_prediction_model.pkl")
