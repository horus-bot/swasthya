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
    diarrhea_model: Option<Arc<Mutex<Session>>>,
    typhoid_model: Option<Arc<Mutex<Session>>>,
}

const DIARRHEA_EXPECTED_FEATURES: usize = 9;

fn normalize_features(mut features: Vec<f32>, expected_len: usize) -> Vec<f32> {
    if features.len() < expected_len {
        features.resize(expected_len, 0.0);
    } else if features.len() > expected_len {
        features.truncate(expected_len);
    }
    features
}

// Try to load an ONNX model file into a Session. Returns None on any error.
fn try_load_model(p: &str) -> Option<Arc<Mutex<Session>>> {
    if Path::new(p).exists() {
        println!("Loading model from {}...", p);
        match SessionBuilder::new() {
            Ok(mut builder) => match builder.commit_from_file(p) {
                Ok(s) => Some(Arc::new(Mutex::new(s))),
                Err(e) => {
                    eprintln!("Failed to load model '{}': {}", p, e);
                    None
                }
            },
            Err(e) => {
                eprintln!("Failed to create SessionBuilder for '{}': {}", p, e);
                None
            }
        }
    } else {
        println!("Model '{}' not found, skipping.", p);
        None
    }
}

async fn predict_typhoid(
    axum::extract::State(state): axum::extract::State<Arc<AppState>>,
    Json(payload): Json<PredictionRequest>,
) -> Json<PredictionResponse> {

    let model_input = payload.features.clone();
    let dims = vec![1_i64, model_input.len() as i64];
    let data = model_input.clone().into_boxed_slice();

    let input_value = match Value::from_array((dims, data)) {
        Ok(v) => v,
        Err(e) => {
            eprintln!("Failed to build typhoid input tensor: {}", e);
            return Json(PredictionResponse { prediction: payload.features.clone() });
        }
    };
    let inputs = inputs![input_value];

    let prediction = if let Some(session_arc) = &state.typhoid_model {

        let mut session = session_arc.lock().await;

        let model_prediction = match session.run(inputs) {
            Ok(outputs) => {
                if let Some((_name, first)) = outputs.iter().next() {
                    match first.try_extract_tensor::<f32>() {
                        Ok((_shape, slice)) => slice.to_vec(),
                        Err(e) => {
                            eprintln!("Failed to extract typhoid output tensor: {}", e);
                            payload.features.clone()
                        }
                    }
                } else {
                    eprintln!("Typhoid inference returned no outputs");
                    payload.features.clone()
                }
            },
            Err(e) => {
                eprintln!("Typhoid inference failed: {}", e);
                payload.features.clone()
            }
        };

        model_prediction

    } else {

        println!("Running fallback mode (model not found)");

        payload.features.clone()
    };

    Json(PredictionResponse { prediction })
}

async fn predict_diarrhea(
    axum::extract::State(state): axum::extract::State<Arc<AppState>>,
    Json(payload): Json<PredictionRequest>,
) -> Json<PredictionResponse> {

    let model_input = normalize_features(payload.features.clone(), DIARRHEA_EXPECTED_FEATURES);
    let dims = vec![1_i64, model_input.len() as i64];
    let data = model_input.clone().into_boxed_slice();

    let input_value = match Value::from_array((dims, data)) {
        Ok(v) => v,
        Err(e) => {
            eprintln!("Failed to build diarrhea input tensor: {}", e);
            return Json(PredictionResponse { prediction: payload.features.clone() });
        }
    };
    let inputs = inputs![input_value];

    let prediction = if let Some(session_arc) = &state.diarrhea_model {

        let mut session = session_arc.lock().await;
        let model_prediction = match session.run(inputs) {
            Ok(outputs) => {
                if let Some((_name, first)) = outputs.iter().next() {
                    match first.try_extract_tensor::<f32>() {
                        Ok((_shape, slice)) => slice.to_vec(),
                        Err(e) => {
                            eprintln!("Failed to extract diarrhea output tensor: {}", e);
                            payload.features.clone()
                        }
                    }
                } else {
                    eprintln!("Diarrhea inference returned no outputs");
                    payload.features.clone()
                }
            },
            Err(e) => {
                eprintln!("Diarrhea inference failed: {}", e);
                payload.features.clone()
            }
        };

        model_prediction

    } else {
        println!("Running fallback mode (diarrhea model not found)");
        payload.features.clone()
    };

    Json(PredictionResponse { prediction })
}

#[tokio::main]
async fn main() {
    let typhoid_model_path = "models/zone_encoder_typhoid.onnx";
    let diarrhea_model_path = "models/diarrhea_prediction_model.onnx";

    let typhoid_session = try_load_model(typhoid_model_path);
    let diarrhea_session = try_load_model(diarrhea_model_path);

    let state = Arc::new(AppState {
        diarrhea_model: diarrhea_session,
        typhoid_model: typhoid_session,
    });

    let app = Router::new()
        .route("/predict/typhoid", post(predict_typhoid))
        .route("/predict/diarrhea", post(predict_diarrhea))
        .with_state(state);

    println!("Server running on http://localhost:3003");

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3003")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}