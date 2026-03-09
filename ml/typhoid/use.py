import sys
import pandas as pd
import numpy as np
import joblib
import json

def load_typhoid_model():
    # Load model, encoder, and metadata
    try:
        model = joblib.load("typhoid_prediction_model.pkl")
        le = joblib.load("zone_encoder_typhoid.pkl")
        with open("model_metadata.json", "r") as f:
            metadata = json.load(f)
        return model, le, metadata
    except Exception as e:
        print(f"Error loading model assets: {e}")
        sys.exit(1)

def predict_typhoid(input_data):
    model, le, metadata = load_typhoid_model()
    
    # 1) Parse input
    year = input_data.get('year', 2026)
    month = input_data.get('month', 11)
    zone_name = input_data.get('zone_name', 'Royapuram')
    rainfall = input_data.get('rainfall_mm', 150)
    temp = input_data.get('temperature_c', 28)
    wqi = input_data.get('water_quality_index', 60)
    fhi = input_data.get('food_hygiene_index', 65)
    prev_cases = input_data.get('prev_month_cases', 20)

    # 2) Encode Zone
    try:
        zone_id_map = {
            "Thiruvottiyur": 1, "Manali": 2, "Madhavaram": 3, "Tondiarpet": 4, 
            "Royapuram": 5, "Thiru-Vi-Ka Nagar": 6, "Ambattur": 7, "Anna Nagar": 8, 
            "Teynampet": 9, "Kodambakkam": 10, "Valasaravakkam": 11, "Alandur": 12, 
            "Adyar": 13, "Perungudi": 14, "Shollinganallur": 15
        }
        zone_id = zone_id_map.get(zone_name, 5)
        zone_encoded = le.transform([zone_name])[0]
    except Exception as e:
        print(f"Zone '{zone_name}' not found. Defaulting to 'Royapuram'.")
        zone_name = "Royapuram"
        zone_id = 5
        zone_encoded = le.transform([zone_name])[0]

    # 3) Clip features to bounds from training
    rainfall = np.clip(rainfall, 0, metadata["ranges"]["rainfall_mm"]["max"])
    temp = np.clip(temp, metadata["ranges"]["temperature_c"]["min"], metadata["ranges"]["temperature_c"]["max"])
    wqi = np.clip(wqi, 10, 100)
    fhi = np.clip(fhi, 20, 100)
    
    pm_cap = metadata["caps"]["prev_month_cases"]
    prev_scaled = np.clip(prev_cases, 0, pm_cap)
    prev_log = np.log1p(prev_scaled)

    # 4) Construct feature array
    features = [
        year,
        month,
        zone_id,
        zone_encoded,
        rainfall,
        temp,
        wqi,
        fhi,
        prev_log
    ]
    
    X = pd.DataFrame([features], columns=metadata["features"])

    # 5) Predict
    pred_log = model.predict(X)[0]
    prediction = np.expm1(pred_log)
    
    return int(round(prediction))

if __name__ == "__main__":
    # Test during a monsoon month with poor sanitation (High Risk context)
    test_input = {
        "year": 2026,
        "month": 11, # Peak Monsoon
        "zone_name": "Royapuram", # Historically vulnerable zone for Typhoid
        "rainfall_mm": 250,
        "temperature_c": 26,
        "water_quality_index": 45, # Poor water quality
        "food_hygiene_index": 50,  # Poor food hygiene
        "prev_month_cases": 45
    }
    
    print("Testing Typhoid Prediction...")
    predicted_cases = predict_typhoid(test_input)
    print(f"Input Data: {test_input}")
    print(f"Predicted Typhoid Cases: {predicted_cases}")
