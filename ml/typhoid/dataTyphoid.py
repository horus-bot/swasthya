import pandas as pd
import numpy as np
import random

# -----------------------------
# Base stats for Typhoid in Chennai
# -----------------------------
# Typhoid cases are usually around 1,500 to 5,000 per year across the city.
# Which is about 100-350 cases per zone per year, roughly 8-30 cases per month on average.
# Peaks heavily in the NE Monsoon (Oct-Jan) and slightly in peak summer (Apr-Jun).
case_mean = 15
case_std = 5

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

# Vulnerability mapping based on typical Chennai Typhoid hotspots.
# North Chennai (Zones 1-5) and river-adjacent (parts of 6,9,10) are more susceptible.
# Lower baseline water sanitation means higher vulnerability.
zone_sanitation_baseline = {
    1: 65, 2: 60, 3: 70, 4: 55, 5: 65,  # North Chennai
    6: 68, 7: 75, 8: 85, 9: 80, 10: 78, # Central
    11: 75, 12: 80, 13: 85, 14: 75, 15: 75 # South
}

MONSOON_MONTHS = [10, 11, 12, 1] # NE Monsoon & Post-monsoon in Chennai
SUMMER_MONTHS = [4, 5, 6]

np.random.seed(42)
rows = []

# Keep state of previous month's cases for autoregressive logic
prev_cases_state = {zid: int(max(0, np.random.normal(case_mean, case_std))) for zid in zones.keys()}

# -----------------------------
# Generate synthetic data
# -----------------------------
for year in range(year_min, year_max + 1):
    
    # Major flood years in Chennai (2015, 2023) cause huge spikes
    year_outbreak_factor = 1.0
    if year in [2015, 2023]:
        year_outbreak_factor = 2.5
    else:
        year_outbreak_factor = np.random.uniform(0.8, 1.3)

    for month in range(1, 13):

        for zone_id, zone_name in zones.items():

            # Weather simulation
            if month in MONSOON_MONTHS:
                rainfall = np.random.uniform(100, 450)
                if year in [2015, 2023] and month in [11, 12]:
                    rainfall = np.random.uniform(400, 900) # Heavy floods
                temperature = np.random.uniform(24, 29)
                wqi_drop = rainfall / 15.0
                food_hygiene_drop = np.random.uniform(5, 15) # Rain makes street food riskier
            elif month in SUMMER_MONTHS:
                rainfall = np.random.uniform(0, 30)
                temperature = np.random.uniform(34, 42)
                # Extreme summer drops WQI due to reliance on Private Tankers
                wqi_drop = (temperature - 34) * 3.0
                food_hygiene_drop = np.random.uniform(0, 5)
            else:
                rainfall = np.random.uniform(10, 60)
                temperature = np.random.uniform(28, 33)
                wqi_drop = 0
                food_hygiene_drop = 0
            
            # Base Water Quality Index (100 is pure, 0 is highly contaminated)
            wqi = zone_sanitation_baseline[zone_id] - wqi_drop + np.random.uniform(-5, 5)
            wqi = np.clip(wqi, 10, 100)

            # Base Food Hygiene Index (100 is best, 0 is worst)
            fhi = zone_sanitation_baseline[zone_id] - food_hygiene_drop + np.random.uniform(-2, 8)
            fhi = np.clip(fhi, 20, 100)
            
            # Risk factors
            water_risk = max(0, (75 - wqi) / 40.0)
            food_risk = max(0, (80 - fhi) / 30.0)
            
            # Temperature also plays a minor role in bacterial survival
            temp_bacterial_factor = max(1.0, temperature / 30.0)

            # Autoregressive generation
            prev_cases = prev_cases_state[zone_id]
            growth_rate = (water_risk * 0.6 + food_risk * 0.4) * temp_bacterial_factor * year_outbreak_factor
            
            # Cases depend on contamination risk + prior cases 
            cases_expected = prev_cases * 0.3 + (case_mean * growth_rate * 2.0)
            
            # Add poisson noise
            cases = np.random.poisson(max(2, cases_expected))

            rows.append({
                "year": year,
                "month": month,
                "zone_id": zone_id,
                "zone_name": zone_name,
                "rainfall_mm": round(rainfall, 2),
                "temperature_c": round(temperature, 2),
                "water_quality_index": round(wqi, 2),
                "food_hygiene_index": round(fhi, 2),
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
synthetic_df.to_csv("synthetic_chennai_typhoid_dataset.csv", index=False)

print("Synthetic Typhoid dataset created")
print(f"Total Rows: {len(synthetic_df)}")
print(f"Average cases per month per zone: {synthetic_df['cases'].mean():.2f}")
print(f"Max cases in a month: {synthetic_df['cases'].max()}")
print(synthetic_df.head())
