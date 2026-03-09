use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use std::path::Path;

use ort::{inputs, session::{Session, builder::SessionBuilder}};
use ort::value::Value;

#[derive(Deserialize)]
struct PredictionRequest {
    features: Vec<f32>,
}

#[derive(Serialize)]
struct PredictionResponse {
    prediction: Vec<f32>,
}

struct AppState {
    session: Option<Arc<Mutex<Session>>>,
}

async fn predict(
    axum::extract::State(state): axum::extract::State<Arc<AppState>>,
    Json(payload): Json<PredictionRequest>,
) -> Json<PredictionResponse> {

    // Build an ONNX tensor from raw dims + data and run the session.
    // `from_array` accepts (dimensions, data) where dims is Vec<i64>
    let dims = vec![1_i64, payload.features.len() as i64];
    let data = payload.features.clone().into_boxed_slice();
    let input_value = Value::from_array((dims, data)).unwrap();

    let inputs = inputs![input_value];

    // If a real session exists, run it. Otherwise return a fallback prediction.
    let prediction = if let Some(session_arc) = &state.session {
        let mut session_guard = session_arc.lock().await;
        let outputs = session_guard.run(inputs).unwrap();
        let (_shape, slice) = outputs[0].try_extract_tensor::<f32>().unwrap();
        slice.to_vec()
    } else {
        // Fallback: echo back the input features as the "prediction"
        payload.features.clone()
    };

    Json(PredictionResponse { prediction })
}

#[tokio::main]
async fn main() {

    // Load ONNX model if present; otherwise run in fallback mode.
    let model_path = "models/emergency_forecast.onnx";
    let session_opt = if Path::new(model_path).exists() {
        let session = SessionBuilder::new()
            .unwrap()
            .commit_from_file(model_path)
            .unwrap();
        Some(Arc::new(Mutex::new(session)))
    } else {
        eprintln!("Model file '{}' not found — running in fallback mode (no model).", model_path);
        None
    };

    let state = Arc::new(AppState { session: session_opt });

    let app = Router::new()
        .route("/predict", post(predict))
        .with_state(state);

    println!("Server running on http://localhost:3003");

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3003")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}