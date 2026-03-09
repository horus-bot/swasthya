# ML Inference Server (axum + ONNX Runtime)

This folder contains the Rust inference server implemented in `src/main.rs`.

This README shows how to build and run the server on Windows (PowerShell) and how to call the HTTP endpoints using `curl.exe` (or PowerShell's `Invoke-RestMethod`).

Server details
- Binary: `ml_inference_server` (run with `cargo run`)
- Port: `3003` (binds to `0.0.0.0:3003`)
- Endpoints (POST only):
  - `/predict/typhoid` — accepts JSON `{ "features": [float,...] }`
  - `/predict/diarrhea` — accepts JSON `{ "features": [float,...] }` (will be normalized/truncated/padded to 9 features)

Prerequisites
- Rust toolchain (rustup + cargo)
- Optional: the ONNX model files in `models/`:
  - `models/zone_encoder_typhoid.onnx`
  - `models/diarrhea_prediction_model.onnx`

If a model file is missing, the server will print a message and run in fallback mode (it returns the input features as the prediction).

Build & run (PowerShell)

Change to this folder and run the server:

```powershell
cd ml_inference_server
cargo run --release
# or for debug build:
cargo run
```

The server prints `Server running on http://localhost:3003` on successful start.

Using `curl.exe` from PowerShell

Note: In PowerShell `curl` is an alias for `Invoke-WebRequest`. To call the native curl binary on Windows use `curl.exe`. Examples below use `curl.exe` so they work in PowerShell.

1) POST `/predict/typhoid`

Example payload (typhoid encoder may accept variable-length features):

```powershell
curl.exe -X POST "http://localhost:3003/predict/typhoid" -H "Content-Type: application/json" -d '{"features":[0.12,0.34,0.56,0.78]}'
```

2) POST `/predict/diarrhea`

This model expects 9 features (the server pads/truncates to 9).

```powershell
curl.exe -X POST "http://localhost:3003/predict/diarrhea" -H "Content-Type: application/json" -d '{"features":[1,2,3,4,5,6,7,8,9]}'
```

PowerShell-native alternative (recommended when building JSON programmatically)

```powershell
#$body can be built as a PowerShell object then converted to JSON (avoids quoting issues)
$body = @{ features = @(1,2,3,4,5,6,7,8,9) } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3003/predict/diarrhea" -Method Post -ContentType "application/json" -Body $body
```

Troubleshooting
- If you see `Model '...' not found, skipping.` the server will still run but produce fallback outputs.
- If the server fails to bind port 3003, ensure no other process is using it and that you have network permissions.

Where to look in source
- Server implementation: [src/main.rs](src/main.rs#L1-L400)

If you want, I can also add example PowerShell scripts that send a series of test requests and pretty-print responses.
