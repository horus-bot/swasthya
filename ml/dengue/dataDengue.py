import pandas as pd
import numpy as np
import random

# -----------------------------
# Load your scraped dataset
# -----------------------------
df = pd.read_csv("output.csv")

df["cases"] = pd.to_numeric(df["cases"], errors="coerce")
df = df.dropna(subset=["cases"])

case_mean = df["cases"].mean()
case_std = df["cases"].std()

year_min = int(df["year"].min())
year_max = int(df["year"].max())

# -----------------------------
# Official Chennai GCC Zones
# -----------------------------
zones = {
    1: "Thiruvottiyur",
    2: "Manali",
    3: "Madhavaram",
    4: "Tondiarpet",
    5: "Royapuram",
    6: "Thiru-Vi-Ka Nagar",
    7: "Ambattur",
    8: "Anna Nagar",
    9: "Teynampet",
    10: "Kodambakkam",
    11: "Valasaravakkam",
    12: "Alandur",
    13: "Adyar",
    14: "Perungudi",
    15: "Shollinganallur"
}

# -----------------------------
# Chennai climate assumptions
# -----------------------------
TEMP_RANGE = (26, 36)
HUM_RANGE = (60, 90)

MONSOON_MONTHS = [9,10,11,12]

# Add a synthetic risk factor for each zone
np.random.seed(42)
zone_risks = {zid: np.random.uniform(0.7, 1.5) for zid in zones.keys()}

rows = []

# Keep state of previous month's cases for autoregressive logic
prev_cases_state = {zid: int(max(0, np.random.normal(case_mean, case_std/2))) for zid in zones.keys()}

# -----------------------------
# Generate synthetic data
# -----------------------------
for year in range(year_min, year_max + 1):
    
    # Introduce a year-level outbreak factor
    year_outbreak_factor = np.random.uniform(0.8, 1.8)

    for month in range(1,13):

        for zone_id, zone_name in zones.items():

            # Weather simulation with slight seasonal variation
            if month in MONSOON_MONTHS:
                rainfall = np.random.uniform(100, 350)
                humidity = np.random.uniform(75, 95)
                temperature = np.random.uniform(25, 30)
                seasonal_factor = 2.0
            elif month in [1, 2, 3]: # Winter / Post monsoon
                rainfall = np.random.uniform(0, 50)
                humidity = np.random.uniform(60, 80)
                temperature = np.random.uniform(24, 32)
                seasonal_factor = 0.5
            else: # Summer
                rainfall = np.random.uniform(0, 20)
                humidity = np.random.uniform(50, 70)
                temperature = np.random.uniform(32, 40)
                seasonal_factor = 0.8

            # mosquito breeding index (non-linear, peaks at specific temp/hum)
            temp_suitability = max(0, 1.0 - abs(temperature - 30) / 10.0)
            hum_suitability = humidity / 100.0
            rain_suitability = min(1.0, rainfall / 200.0)
            
            mosquito_index = np.clip(
                (0.4 * rain_suitability + 0.4 * hum_suitability + 0.2 * temp_suitability),
                0.0, 1.0
            )

            # Autoregressive generation
            prev_cases = prev_cases_state[zone_id]
            growth_rate = mosquito_index * seasonal_factor * zone_risks[zone_id] * year_outbreak_factor
            
            # Cases depend on prior cases + some mean reversion
            cases_expected = prev_cases * growth_rate * 0.7 + case_mean * 0.3
            
            # Add poisson noise
            cases = np.random.poisson(max(1, cases_expected))

            rows.append({
                "year": year,
                "month": month,
                "zone_id": zone_id,
                "zone_name": zone_name,
                "rainfall_mm": round(rainfall,2),
                "temperature_c": round(temperature,2),
                "humidity_percent": round(humidity,2),
                "mosquito_index": round(mosquito_index,3),
                "cases": cases
            })
            
            # Update state for next month
            prev_cases_state[zone_id] = cases

synthetic_df = pd.DataFrame(rows)

# -----------------------------
# Temporal feature
# -----------------------------
synthetic_df = synthetic_df.sort_values(["zone_id","year","month"])

synthetic_df["prev_month_cases"] = (
    synthetic_df.groupby("zone_id")["cases"].shift(1)
)

synthetic_df["prev_month_cases"] = synthetic_df["prev_month_cases"].fillna(0)

# -----------------------------
# Save dataset
# -----------------------------
synthetic_df.to_csv("synthetic_chennai_dengue_dataset.csv", index=False)

print("Synthetic dataset created")
print("Rows:", len(synthetic_df))
print(synthetic_df.head())