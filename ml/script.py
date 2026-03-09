import argparse
import os
import sys
try:
    import joblib
except Exception:
    print("Missing dependency: joblib. Install with `pip install joblib` and retry.")
    sys.exit(1)
try:
    from skl2onnx import convert_sklearn
    from skl2onnx.common.data_types import FloatTensorType
except Exception:
    print("Missing dependency: skl2onnx (or its dependencies). Install with `pip install skl2onnx onnx onnxruntime` and retry.")
    sys.exit(1)


def convert_pkl_to_onnx(pkl_path: str, n_features: int, out_dir: str | None = None):
    # Resolve paths
    pkl_path = os.path.abspath(pkl_path)
    if not os.path.isfile(pkl_path):
        raise FileNotFoundError(f"PKL file not found: {pkl_path}")

    model = joblib.load(pkl_path)

    # Prepare output directory
    if out_dir:
        out_dir = os.path.abspath(out_dir)
    else:
        out_dir = os.path.join(os.path.dirname(pkl_path), "onnx")
    os.makedirs(out_dir, exist_ok=True)

    base_name = os.path.splitext(os.path.basename(pkl_path))[0]
    out_path = os.path.join(out_dir, f"{base_name}.onnx")

    # Prepare input type for conversion
    initial_type = [("float_input", FloatTensorType([None, n_features]))]

    try:
        onnx_model = convert_sklearn(model, initial_types=initial_type)
        with open(out_path, "wb") as f:
            f.write(onnx_model.SerializeToString())
        print(f"Model successfully converted to ONNX: {out_path}")
        return out_path
    except Exception as e:
        # Conversion failed — save a copy of the original PKL into the onnx dir for reference
        fallback_path = os.path.join(out_dir, f"{base_name}.pkl")
        joblib.dump(model, fallback_path)
        print(f"ONNX conversion failed: {e}")
        print(f"Saved model copy to: {fallback_path}")
        raise


def main():
    # Determine script directory (this file lives under the repo ml/ folder)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    default_pkl = os.path.join(script_dir, "typhoid", "zone_encoder_typhoid.pkl")
    default_out = os.path.join(script_dir, "omnx")

    parser = argparse.ArgumentParser(description="Convert a scikit-learn PKL model to ONNX and save into an onnx/ directory")
    parser.add_argument("pkl", nargs='?', default=default_pkl, help=f"Path to the .pkl model file (default: {default_pkl})")
    parser.add_argument("--features", "-f", type=int, default=None, help="Number of input features (columns) the model expects; if omitted will try to read model_metadata.json next to the PKL")
    parser.add_argument("--out", "-o", default=default_out, help=f"Optional output directory (default: {default_out})")
    args = parser.parse_args()
    # If features not provided, try to auto-detect from a model_metadata.json beside the PKL
    n_features = args.features
    if n_features is None:
        meta_path = os.path.join(os.path.dirname(os.path.abspath(args.pkl)), "model_metadata.json")
        if os.path.isfile(meta_path):
            try:
                import json as _json
                with open(meta_path, "r") as _fh:
                    meta = _json.load(_fh)
                    n_features = len(meta.get("features", []))
                    print(f"Auto-detected n_features={n_features} from {meta_path}")
            except Exception:
                n_features = 10
        else:
            n_features = 10

    try:
        convert_pkl_to_onnx(args.pkl, n_features, args.out)
    except Exception as e:
        import traceback
        print("Conversion process finished with errors.")
        traceback.print_exc()


if __name__ == "__main__":
    main()