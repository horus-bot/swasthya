import sys
import pandas as pd
import numpy as np
import joblib
import json

def load_diarrhea_model():
    # Load model, encoder, and metadata
    try:
        model = joblib.load("diarrhea_prediction_model.pkl")
        le = joblib.load("zone_encoder_diarrhea.pkl")
        with open("model_metadata.json", "r") as f:
            metadata = json.load(f)
        return model, le, metadata
    except Exception as e:
        print(f"Error loading model assets: {e}")
        sys.exit(1)

def predict_diarrhea(input_data):
    model, le, metadata = load_diarrhea_model()
    
    # 1) Parse input
    year = input_data.get('year', 2026)
    month = input_data.get('month', 9)
    zone_name = input_data.get('zone_name', 'Manali')
    rainfall = input_data.get('rainfall_mm', 150)
    temp = input_data.get('temperature_c', 30)
    wqi = input_data.get('water_quality_index', 60)
    sanitation = input_data.get('sanitation_index', 70)
    prev_cases = input_data.get('prev_month_cases', 150)

    # 2) Encode Zone
    try:
        zone_id_map = {
            "Thiruvottiyur": 1, "Manali": 2, "Madhavaram": 3, "Tondiarpet": 4, 
            "Royapuram": 5, "Thiru-Vi-Ka Nagar": 6, "Ambattur": 7, "Anna Nagar": 8, 
            "Teynampet": 9, "Kodambakkam": 10, "Valasaravakkam": 11, "Alandur": 12, 
            "Adyar": 13, "Perungudi": 14, "Shollinganallur": 15
        }
        zone_id = zone_id_map.get(zone_name, 2)
        zone_encoded = le.transform([zone_name])[0]
    except Exception as e:
        print(f"Zone '{zone_name}' not found. Defaulting to 'Manali'.")
        zone_name = "Manali"
        zone_id = 2
        zone_encoded = le.transform([zone_name])[0]

    # 3) Clip features to bounds from training
    rainfall = np.clip(rainfall, 0, metadata["ranges"]["rainfall_mm"]["max"])
    temp = np.clip(temp, metadata["ranges"]["temperature_c"]["min"], metadata["ranges"]["temperature_c"]["max"])
    wqi = np.clip(wqi, 10, 100)
    
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
        sanitation,
        prev_log
    ]
    
    X = pd.DataFrame([features], columns=metadata["features"])

    # 5) Predict
    pred_log = model.predict(X)[0]
    prediction = np.expm1(pred_log)
    
    return int(round(prediction))

if __name__ == "__main__":
    test_input = {
        "year": 2026,
        "month": 11, # Monsoon peak
        "zone_name": "Manali",
        "rainfall_mm": 300,
        "temperature_c": 28,
        "water_quality_index": 45, # Poor water quality
        "sanitation_index": 60,
        "prev_month_cases": 250
    }
    
    print("Testing Diarrhea Prediction...")
    predicted_cases = predict_diarrhea(test_input)
    print(f"Input Data: {test_input}")
    print(f"Predicted Diarrhea Cases: {predicted_cases}")
