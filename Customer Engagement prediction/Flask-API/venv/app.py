from flask import Flask, request, jsonify
import torch
from model import HeteroGCN  # Import your trained model

app = Flask(__name__)

# Initialize the model
model = HeteroGCN(hidden_dim=32)

# Load the saved model weights
model_weights_path = "A:/DSGP/InsightHive/Customer Engagement prediction/Models/sage_model.pth"
state_dict = torch.load(model_weights_path, map_location=torch.device("cpu"))
model.load_state_dict(state_dict)
model.eval()  # Set model to evaluation mode

# Edge index dictionary
edge_index_dict = {
    ("campaign", "hosted_on", "platform"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),
    ("platform", "rev_hosted_on", "campaign"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),
    ("campaign", "uses", "channel"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),
    ("channel", "rev_uses", "campaign"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),
    ("platform", "supports", "channel"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),
    ("campaign", "uses", "creative"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),
    ("creative", "designed_with", "template"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),
    ("campaign", "associated_with", "keywords"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),
    ("platform", "optimized_for", "keywords"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),
    ("campaign", "managed_by", "network"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),
    ("campaign", "belongs_to", "advertiser"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),
}

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Customer Engagement Prediction API is running!"})

@app.route("/predict", methods=["POST"])
def predict():
    if request.method == "GET":
        return jsonify({"message": "This endpoint only supports POST requests"}), 405
    try:
        data = request.get_json()

        # Convert input JSON into PyTorch tensors
        test_input = {
            "campaign": torch.tensor([data["campaign"]], dtype=torch.float),
            "platform": torch.tensor([data["platform"]], dtype=torch.float),
            "channel": torch.tensor([data["channel"]], dtype=torch.float),
            "creative": torch.tensor([data["creative"]], dtype=torch.float),
            "template": torch.tensor([data["template"]], dtype=torch.float),
            "network": torch.tensor([data["network"]], dtype=torch.float),
            "keywords": torch.tensor([data["keywords"]], dtype=torch.float),
            "advertiser": torch.tensor([data["advertiser"]], dtype=torch.float)
        }

        # ✅ Pass edge_index_dict to the model
        with torch.no_grad():
            output = model(test_input, edge_index_dict)

        return jsonify({"prediction": output.tolist()})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)

