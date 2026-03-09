import pandas as pd
import joblib
import numpy as np
import json

# load artifacts
model = joblib.load("dengue_prediction_model.pkl")
encoder = joblib.load("zone_encoder.pkl")

# try to load metadata ranges saved at training time; fall back to defaults
try:
    with open("model_metadata.json", "r") as fh:
        _metadata = json.load(fh)
        _ranges = _metadata.get("ranges", {})
except Exception:
    _ranges = {}

def _get_range(feature, default_min, default_max):
    r = _ranges.get(feature)
    if r is None:
        return float(default_min), float(default_max)
    return float(r.get("min", default_min)), float(r.get("max", default_max))


def predict_dengue_cases(
    year,
    month,
    zone_id=None,
    zone_name=None,
    rainfall_mm=0,
    temperature_c=26,
    humidity_percent=60,
    mosquito_index=None,
    prev_month_cases=0
):
    """Predict dengue cases with input clipping and safety checks.

    All numeric inputs are clamped to realistic ranges based on training data.
    If `mosquito_index` is not provided, it's computed from rainfall/temperature/humidity.
    Unknown `zone_name` falls back to the most frequent encoded zone.
    """

    # basic conversions
    rainfall_mm = float(rainfall_mm)
    temperature_c = float(temperature_c)
    humidity_percent = float(humidity_percent)
    prev_month_cases = float(prev_month_cases)

    # clamp values to realistic ranges (from metadata when available)
    rf_min, rf_max = _get_range("rainfall_mm", 0.0, 150.0)
    t_min, t_max = _get_range("temperature_c", 26.0, 36.0)
    h_min, h_max = _get_range("humidity_percent", 50.0, 95.0)
    pm_min, pm_max = _get_range("prev_month_cases", 0.0, 200.0)

    rainfall_mm = np.clip(rainfall_mm, rf_min, rf_max)
    temperature_c = np.clip(temperature_c, t_min, t_max)
    humidity_percent = np.clip(humidity_percent, h_min, h_max)
    prev_month_cases = np.clip(prev_month_cases, pm_min, pm_max)

    # compute mosquito index if not provided
    if mosquito_index is None:
        mosquito_index = (
            0.45 * (rainfall_mm / 150.0)
            + 0.35 * (humidity_percent / 100.0)
            + 0.2 * (temperature_c / 36.0)
        )
    mosquito_index = float(mosquito_index)
    mosquito_index = np.clip(mosquito_index, 0.0, 1.0)

    # encode zone_name safely
    if zone_name is None:
        raise ValueError("zone_name is required")
    try:
        zone_encoded = int(encoder.transform([zone_name])[0])
    except Exception:
        # fallback: use most frequent class (encoder.classes_[0])'s code 0
        zone_encoded = 0

    if zone_id is None:
        try:
            zone_id = int(zone_encoded) + 1
        except Exception:
            zone_id = 0

    # compute both raw and log prev_month_cases so we can support models
    # trained with either raw or log feature names
    prev_month_cases_clipped = prev_month_cases
    prev_month_cases_log = float(np.log1p(prev_month_cases_clipped))

    full_row = {
        "year": int(year),
        "month": int(month),
        "zone_id": int(zone_id),
        "zone_encoded": int(zone_encoded),
        "rainfall_mm": rainfall_mm,
        "temperature_c": temperature_c,
        "humidity_percent": humidity_percent,
        "mosquito_index": mosquito_index,
        "prev_month_cases": prev_month_cases_clipped,
        "prev_month_cases_log": prev_month_cases_log,
    }

    # determine which features the model expects
    try:
        expected = list(model.feature_names_in_)
    except Exception:
        expected = None

    if expected is None:
        # fallback: try both common feature sets
        if "prev_month_cases_log" in full_row:
            expected = [
                "year",
                "month",
                "zone_id",
                "zone_encoded",
                "rainfall_mm",
                "temperature_c",
                "humidity_percent",
                "mosquito_index",
                "prev_month_cases_log",
            ]
        else:
            expected = [
                "year",
                "month",
                "zone_id",
                "zone_encoded",
                "rainfall_mm",
                "temperature_c",
                "humidity_percent",
                "mosquito_index",
                "prev_month_cases",
            ]

    # construct DataFrame in expected column order
    try:
        data = pd.DataFrame([{k: full_row[k] for k in expected}])
    except KeyError as e:
        raise ValueError(f"Model expects feature {e.args[0]!r} which is not available in input row")

    # debug: show what the model expects and the prepared input
    try:
        model_expected = list(model.feature_names_in_)
    except Exception:
        model_expected = getattr(model, "feature_names_in_", None)

    print("Model expected features:", model_expected)
    print("Prepared input:", data.to_dict(orient="records")[0])

    try:
        prediction = float(model.predict(data)[0])
    except ValueError as e:
        # re-raise with helpful debug info
        msg = str(e)
        msg = msg + f"\nProvided features: {list(data.columns)}\nModel expected: {model_expected}"
        raise ValueError(msg)

    # clamp output to realistic dengue range using training metadata if available
    cases_min, cases_max = _get_range("cases", 0.0, 500.0)
    clamp_max = max(500.0, cases_max)
    prediction = float(np.clip(prediction, 0.0, clamp_max))

    return int(round(prediction))


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Test dengue prediction model")
    parser.add_argument("--year", type=int, default=2021)
    parser.add_argument("--month", type=int, default=10)
    parser.add_argument("--zone_name", type=str, default=None)
    parser.add_argument("--zone_id", type=int, default=None)
    parser.add_argument("--rainfall_mm", type=float, default=110.0)
    parser.add_argument("--temperature_c", type=float, default=29.0)
    parser.add_argument("--humidity_percent", type=float, default=80.0)
    parser.add_argument("--mosquito_index", type=float, default=None)
    parser.add_argument("--prev_month_cases", type=float, default=45.0)
    parser.add_argument("--sample", action="store_true", help="Run a built-in sample test")
    parser.add_argument("--list-zones", action="store_true", help="List known zone names from encoder")

    args = parser.parse_args()

    # If the user ran the script with no arguments, default to the sample run
    import sys
    if len(sys.argv) == 1:
        print("No CLI args provided — running built-in sample. Use --help for options.")
        args.sample = True

    if args.list_zones:
        try:
            classes = list(encoder.classes_)
            print("Known zones (encoder.classes_):")
            for c in classes:
                print(" -", c)
        except Exception:
            print("Zone encoder not available or has no classes_")
        raise SystemExit(0)

    if args.sample and args.zone_name is None:
        # sample values
        args.zone_name = "Thiruvottiyur"
        args.rainfall_mm = 110.0
        args.temperature_c = 29.0
        args.humidity_percent = 80.0
        args.prev_month_cases = 45.0

    if args.zone_name is None:
        parser.error("--zone_name is required (or use --sample)")

    print("Input (raw):")
    print(vars(args))

    pred = predict_dengue_cases(
        year=args.year,
        month=args.month,
        zone_id=args.zone_id,
        zone_name=args.zone_name,
        rainfall_mm=args.rainfall_mm,
        temperature_c=args.temperature_c,
        humidity_percent=args.humidity_percent,
        mosquito_index=args.mosquito_index,
        prev_month_cases=args.prev_month_cases,
    )

    print("Predicted Dengue Cases:", pred)