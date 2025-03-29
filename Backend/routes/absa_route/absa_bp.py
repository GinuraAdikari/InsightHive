from flask import Blueprint, request, jsonify
import pandas as pd
from routes.absa_route.absa_engine import run_absa_pipeline, run_vader_pipeline
from flask_cors import CORS

absa_bp = Blueprint("absa_bp", __name__)
CORS(absa_bp)

@absa_bp.route("/analyze", methods=["POST"])
def analyze_absa():
    print("ABSA endpoint hit successfully")

    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        df = pd.read_csv(file)
        print("===> Reading CSV....")
        print(df.head())

        # Read mode (fast or model)
        mode = request.form.get("mode", "model")
        print("===> Mode selected:", mode)

        if "review" not in df.columns:
            return jsonify({"error": "Missing 'review' column in CSV"}), 400

        # Run pipeline
        if mode == "fast":
            results = run_vader_pipeline(df)
        else:
            results = run_absa_pipeline(df)

        return jsonify({"results": results})

    except Exception as e:
        print("Error occurred:", e)
        return jsonify({"error": str(e)}), 500