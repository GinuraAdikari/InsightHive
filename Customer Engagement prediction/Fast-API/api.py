from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

import torch
from model import HeteroGCN  # Import your trained model

# Initialize FastAPI
app = FastAPI()

# Initialize the model
model = HeteroGCN(hidden_dim=32)

# Load the saved model weights
model_weights_path = "A:/DSGP/InsightHive/Customer Engagement prediction/Models/sage_model.pth"
state_dict = torch.load(model_weights_path, map_location=torch.device("cpu"))
model.load_state_dict(state_dict)
model.eval()  # Set model to evaluation mode

# Test input (same as what we are using in API)
x_dict = {
    "campaign": torch.tensor([[1000, 3]], dtype=torch.float),
    "platform": torch.tensor([[0, 1, 0]], dtype=torch.float),
    "channel": torch.tensor([[0, 0, 0, 0, 1]], dtype=torch.float),
    "creative": torch.tensor([[1600, 0]], dtype=torch.float),
    "template": torch.tensor([[91]], dtype=torch.float),
    "network": torch.tensor([[190]], dtype=torch.float),
    "keywords": torch.rand((1, 50), dtype=torch.float),
    "advertiser": torch.rand((1, 51), dtype=torch.float)
}

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


# Try calling model with only x_dict
try:
    output = model(x_dict)  # This will fail if edge_index_dict is required
    print("Model output:", output)
except TypeError as e:
    print("Error:", str(e))

# Define data structure (matches your model input format)
data = {
    "campaign": {"x": torch.empty((0, 2))},
    "platform": {"x": torch.empty((0, 3))},
    "channel": {"x": torch.empty((0, 5))},
    "creative": {"x": torch.empty((0, 2))},
    "template": {"x": torch.empty((0, 1))},
    "network": {"x": torch.empty((0, 1))},
    "keywords": {"x": torch.empty((0, 50))},
    "advertiser": {"x": torch.empty((0, 51))}
}


# Define Input Model for API
class FeatureInput(BaseModel):
    campaign_feature: List[float]
    platform_feature: List[int]
    channel_feature: List[int]
    creative_feature: List[float]
    template_feature: List[float]
    network_feature: List[float]
    keywords_feature: List[float]
    advertiser_feature: List[float]

# Root endpoint
@app.get("/")
def home():
    return {"message": "Customer Engagement Prediction API is running!"}

# Prediction Endpoint
@app.post("/predict")
async def predict(features: FeatureInput):
    try:
        # Convert input data to tensors
        new_campaign = torch.tensor([features.campaign_feature], dtype=torch.float)
        new_platform = torch.tensor([features.platform_feature], dtype=torch.float)
        new_channel = torch.tensor([features.channel_feature], dtype=torch.float)
        new_creative = torch.tensor([features.creative_feature], dtype=torch.float)
        new_template = torch.tensor([features.template_feature], dtype=torch.float)
        new_network = torch.tensor([features.network_feature], dtype=torch.float)
        new_keywords = torch.tensor([features.keywords_feature], dtype=torch.float)
        new_advertiser = torch.tensor([features.advertiser_feature], dtype=torch.float)

        # Create input dictionary for model
        input_data = {
            "campaign": new_campaign,
            "platform": new_platform,
            "channel": new_channel,
            "creative": new_creative,
            "template": new_template,
            "network": new_network,
            "keywords": new_keywords,
            "advertiser": new_advertiser
        }

        # Run model inference
        with torch.no_grad():
            output = model(input_data)

        return {"prediction": output.tolist()}  # Convert tensor to JSON response
    except Exception as e:
        return {"error": str(e)}


@app.get("/test-prediction")
def test_prediction():
    try:
        # Sample test input
        test_input = {
            "campaign": torch.tensor([[1000, 3]], dtype=torch.float),
            "platform": torch.tensor([[0, 1, 0]], dtype=torch.float),
            "channel": torch.tensor([[0, 0, 0, 0, 1]], dtype=torch.float),
            "creative": torch.tensor([[1600, 0]], dtype=torch.float),
            "template": torch.tensor([[91]], dtype=torch.float),
            "network": torch.tensor([[190]], dtype=torch.float),
            "keywords": torch.rand((1, 50), dtype=torch.float),
            "advertiser": torch.rand((1, 51), dtype=torch.float)
        }

        # ✅ Pass edge_index_dict to the model
        with torch.no_grad():
            output = model(test_input, edge_index_dict)

        return {"test_prediction": output.tolist()}
    except Exception as e:
        return {"error": str(e)}
