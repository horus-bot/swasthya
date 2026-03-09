import argparse
import os
import sys

# Check dependencies
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


def convert_pkl_to_onnx(pkl_path: str, n_features: int, out_dir: str | None = None, model_name: str | None = None):
    # Resolve PKL path
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

    # Determine ONNX model name
    base_name = os.path.splitext(os.path.basename(pkl_path))[0]
    out_name = model_name if model_name else base_name
    out_path = os.path.join(out_dir, f"{out_name}.onnx")

    # Prepare input type for conversion
    initial_type = [("float_input", FloatTensorType([None, n_features]))]

    try:
        onnx_model = convert_sklearn(model, initial_types=initial_type)

        with open(out_path, "wb") as f:
            f.write(onnx_model.SerializeToString())

        print(f"Model successfully converted to ONNX: {out_path}")
        return out_path

    except Exception as e:
        fallback_path = os.path.join(out_dir, f"{out_name}.pkl")
        joblib.dump(model, fallback_path)

        print(f"ONNX conversion failed: {e}")
        print(f"Saved model copy to: {fallback_path}")
        raise


def main():
    # Determine script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Default paths
    default_pkl = os.path.join(script_dir, "diarrhea", "diarrhea_prediction_model.pkl")
    default_out = os.path.join(script_dir, "onnx")

    parser = argparse.ArgumentParser(
        description="Convert a scikit-learn PKL model to ONNX and save into an onnx/ directory"
    )

    parser.add_argument(
        "pkl",
        nargs="?",
        default=default_pkl,
        help=f"Path to the .pkl model file (default: {default_pkl})"
    )

    parser.add_argument(
        "--features",
        "-f",
        type=int,
        default=None,
        help="Number of input features the model expects; if omitted will try to read model_metadata.json"
    )

    parser.add_argument(
        "--out",
        "-o",
        default=default_out,
        help=f"Output directory for ONNX model (default: {default_out})"
    )

    parser.add_argument(
        "--name",
        "-n",
        default=None,
        help="Custom name for the ONNX model file"
    )

    args = parser.parse_args()

    # Detect feature count automatically if not provided
    n_features = args.features

    if n_features is None:
        meta_path = os.path.join(os.path.dirname(os.path.abspath(args.pkl)), "model_metadata.json")

        if os.path.isfile(meta_path):
            try:
                import json

                with open(meta_path, "r") as fh:
                    meta = json.load(fh)

                n_features = len(meta.get("features", []))
                print(f"Auto-detected n_features={n_features} from {meta_path}")

            except Exception:
                print("Could not read metadata file. Defaulting to 10 features.")
                n_features = 10
        else:
            print("No metadata found. Defaulting to 10 features.")
            n_features = 10

    try:
        convert_pkl_to_onnx(args.pkl, n_features, args.out, args.name)

    except Exception:
        import traceback
        print("Conversion process finished with errors.")
        traceback.print_exc()


if __name__ == "__main__":
    main()