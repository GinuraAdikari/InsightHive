from flask import Flask, request, jsonify
import numpy as np
from flask_cors import CORS
import torch
from model import HeteroGCN  # Import your trained model
from embedding_util import embeddings_index, get_text_embedding

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the model
model = HeteroGCN(hidden_dim=32)

# Global variable to store received data
stored_data = {}

# Load the saved model weights


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Process the data as needed (e.g., run it through the model)
    print("Received data:", data)

    # Example response (you can modify based on model output or prediction results)
    response = {
        "message": "Prediction successful! Data received and processed. ",
        "Hello everyone": "This is a test message",
        "receivedData": data  # Send the received data back to the frontend
    }

    return jsonify(response)





if __name__ == "__main__":
    app.run(debug=True)
