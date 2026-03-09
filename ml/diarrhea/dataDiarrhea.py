import pandas as pd
import numpy as np
import random

# -----------------------------
# Base stats for Diarrhea in Chennai
# -----------------------------
# Diarrhea cases are higher on average than Dengue, with significant spikes 
# during monsoons (due to sewage mixing with drinking water) and summer (water scarcity).
# Typical monthly baseline per zone could be ~150 cases, spiking up to 800+ in bad months.
case_mean = 150
case_std = 50

year_min = 2015
year_max = 2024

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

# Vulnerability mapping based on historical infrastructure issues and population density.
# Lower baseline sanitation index means higher vulnerability.
# North Chennai (Zones 1-5) and some extended areas often face more severe water-logging.
zone_sanitation_baseline = {
    1: 65, 2: 60, 3: 70, 4: 55, 5: 65,  # North Chennai (often lower sanitation due to older infra / industries)
    6: 70, 7: 75, 8: 85, 9: 90, 10: 80, # Central / Well developed
    11: 75, 12: 80, 13: 85, 14: 75, 15: 75 # South / IT corridor
}

MONSOON_MONTHS = [9, 10, 11, 12]
SUMMER_MONTHS = [4, 5, 6]

np.random.seed(42)

rows = []

# Keep state of previous month's cases for autoregressive logic
prev_cases_state = {zid: int(max(0, np.random.normal(case_mean, case_std))) for zid in zones.keys()}

# -----------------------------
# Generate synthetic data
# -----------------------------
for year in range(year_min, year_max + 1):
    
    # Introduce a year-level severity factor (e.g., major flood years like 2015, 2023)
    year_outbreak_factor = 1.0
    if year in [2015, 2023]:
        year_outbreak_factor = 2.0
    else:
        year_outbreak_factor = np.random.uniform(0.8, 1.3)

    for month in range(1, 13):

        for zone_id, zone_name in zones.items():

            # Weather simulation
            if month in MONSOON_MONTHS:
                rainfall = np.random.uniform(100, 400)
                if year in [2015, 2023] and month in [11, 12]:
                    rainfall = np.random.uniform(400, 800) # Heavy floods
                temperature = np.random.uniform(25, 30)
                # Monsoon causes sewage mixing, dropping Water Quality Index (WQI)
                wqi_drop = rainfall / 10.0
            elif month in SUMMER_MONTHS:
                rainfall = np.random.uniform(0, 30)
                temperature = np.random.uniform(34, 41)
                # Extreme summer also drops WQI due to dried up reservoirs and ground water reliance
                wqi_drop = (temperature - 33) * 2.5
            else:
                rainfall = np.random.uniform(0, 50)
                temperature = np.random.uniform(24, 32)
                wqi_drop = 0
            
            # Base Water Quality Index (100 is pure, 0 is highly contaminated)
            # Driven by sanitation baseline and seasonal drops
            wqi = zone_sanitation_baseline[zone_id] - wqi_drop + np.random.uniform(-5, 5)
            wqi = np.clip(wqi, 10, 100)
            
            # Risk factor for diarrhea is inversely proportional to WQI
            # < 50 WQI implies high risk of waterborne diseases
            contamination_risk = max(0, (75 - wqi) / 50.0)
            
            # Temperature also plays a role in bacterial growth
            temp_bacterial_factor = max(1.0, temperature / 30.0)

            # Autoregressive generation
            prev_cases = prev_cases_state[zone_id]
            growth_rate = contamination_risk * temp_bacterial_factor * year_outbreak_factor
            
            # Cases depend on contamination risk + prior cases + some mean reversion
            cases_expected = prev_cases * 0.4 + (case_mean * growth_rate * 1.5)
            
            # Add poisson noise
            cases = np.random.poisson(max(10, cases_expected))

            rows.append({
                "year": year,
                "month": month,
                "zone_id": zone_id,
                "zone_name": zone_name,
                "rainfall_mm": round(rainfall, 2),
                "temperature_c": round(temperature, 2),
                "water_quality_index": round(wqi, 2),
                "sanitation_index": zone_sanitation_baseline[zone_id],
                "cases": cases
            })
            
            # Update state for next month
            prev_cases_state[zone_id] = cases

synthetic_df = pd.DataFrame(rows)

# -----------------------------
# Temporal feature
# -----------------------------
synthetic_df = synthetic_df.sort_values(["zone_id", "year", "month"])

synthetic_df["prev_month_cases"] = (
    synthetic_df.groupby("zone_id")["cases"].shift(1)
)

# Fill starting NaNs with the mean of that zone
for zone_id in synthetic_df["zone_id"].unique():
    zone_mean = synthetic_df[synthetic_df["zone_id"] == zone_id]["cases"].mean()
    synthetic_df.loc[(synthetic_df["zone_id"] == zone_id) & (synthetic_df["prev_month_cases"].isna()), "prev_month_cases"] = int(zone_mean)

# -----------------------------
# Save dataset
# -----------------------------
synthetic_df.to_csv("synthetic_chennai_diarrhea_dataset.csv", index=False)

print("Synthetic Diarrhea dataset created")
print("Rows:", len(synthetic_df))
print(synthetic_df.head())
