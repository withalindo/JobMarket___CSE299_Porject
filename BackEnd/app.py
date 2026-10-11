import os
import time
from collections import Counter

import joblib
from flask import Flask, request, jsonify
from waitress import serve

app = Flask(__name__)

# Resolve the models folder relative to this file so the service works from any working
# directory (and on case-sensitive systems: the folder is "predictionModels").
MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'predictionModels')
PORT = int(os.environ.get('ML_PORT', 2001))

# Load all models and components once at startup
tfidf_vectorizer = None
label_encoder = None
logistic_regression_model = None
svm_model = None
xgboost_model = None

try:
    start_time = time.time()

    tfidf_vectorizer = joblib.load(os.path.join(MODELS_DIR, 'tfidf_vectorizer.joblib'))
    label_encoder = joblib.load(os.path.join(MODELS_DIR, 'label_encoder.joblib'))
    logistic_regression_model = joblib.load(os.path.join(MODELS_DIR, 'logistic_regression_model.joblib'))
    svm_model = joblib.load(os.path.join(MODELS_DIR, 'svm_model.joblib'))
    xgboost_model = joblib.load(os.path.join(MODELS_DIR, 'xgboost_model.joblib'))

    print(f"Models and components loaded in {time.time() - start_time:.2f} seconds")

except Exception as e:
    print(f"Error loading models on startup: {e}")
    tfidf_vectorizer = label_encoder = None
    logistic_regression_model = svm_model = xgboost_model = None


def models_ready():
    return all(
        component is not None
        for component in (tfidf_vectorizer, label_encoder, logistic_regression_model, svm_model, xgboost_model)
    )


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok" if models_ready() else "models_not_loaded"}), (200 if models_ready() else 503)


@app.route('/predict', methods=['POST'])
def predict():
    """
    An API endpoint that takes a JSON object with 'text' and returns a prediction
    based on a majority vote from multiple models.
    """
    if not models_ready():
        return jsonify({"error": "Models failed to load on startup. Check the model file paths."}), 500

    try:
        data = request.get_json(force=True)
        text_input = data.get('text') if isinstance(data, dict) else None
        if not isinstance(text_input, str) or not text_input.strip():
            return jsonify({"error": "Request body must be JSON with a non-empty 'text' field."}), 400

        # Pre-process the input text
        text_vectorized = tfidf_vectorizer.transform([text_input])

        # Get predictions from all three models
        lr_prediction_encoded = logistic_regression_model.predict(text_vectorized)
        svm_prediction_encoded = svm_model.predict(text_vectorized)
        xgb_prediction_encoded = xgboost_model.predict(text_vectorized)

        # Decode the numerical predictions to human-readable labels
        lr_prediction_label = str(label_encoder.inverse_transform(lr_prediction_encoded)[0])
        svm_prediction_label = str(label_encoder.inverse_transform(svm_prediction_encoded)[0])
        xgb_prediction_label = str(label_encoder.inverse_transform(xgb_prediction_encoded)[0])

        # Collect all predictions for majority vote
        predictions = [lr_prediction_label, svm_prediction_label, xgb_prediction_label]

        # Determine final prediction by majority vote
        final_prediction = Counter(predictions).most_common(1)[0][0]

        return jsonify({
            'logistic_regression_prediction': lr_prediction_label,
            'svm_prediction': svm_prediction_label,
            'xgboost_prediction': xgb_prediction_label,
            'final_prediction': final_prediction,
            'all_predictions': predictions
        })

    except Exception as e:
        return jsonify({"error": f"An error occurred during prediction: {e}"}), 400


if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=PORT)
