from flask import Blueprint, jsonify, request
import torch
from .model import HeteroGCN  # Import your trained model
from pymongo import MongoClient
from flask_cors import CORS
import numpy as np
import os
import certifi


engagement_bp = Blueprint('engagement',__name__)

CORS(engagement_bp, resources={r"/*": {"origins": "http://localhost:3000"}})

# Connect to MongoDB

MONGO_URI = "mongodb+srv://admin:wWjG3R!xX_CRDhY@insight.zvb5r.mongodb.net/?retryWrites=true&w=majority&appName=Insight"

client = MongoClient(MONGO_URI,
                    tls=True,
                    tlsCAFile=certifi.where()
)  # Ensures proper SSL certificates)  # Change if hosted elsewhere

print(certifi.where())  # This gives the path to the certificate file

db = client["Customer_Engagement"]  # Database name
collection = db["Prediction_details"]  # Collection name

    
# Initialize the model
model = HeteroGCN(hidden_dim=32)

# Load the saved model weights
current_dir = os.path.dirname(os.path.abspath(__file__))
model_weights_path = os.path.join(current_dir, '../../models/customer_engagement_model/sage_model.pth')
glove_path = os.path.join(current_dir, '../../models/customer_engagement_model/glove.6B.50d.txt')
state_dict = torch.load(model_weights_path, map_location=torch.device("cpu"), weights_only = True)
model.load_state_dict(state_dict)
model.eval()  # Set model to evaluation mode

@engagement_bp.route("/previous-campaigns", methods=["GET"])
def get_previous_campaigns():
    campaigns = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB `_id` field
    return jsonify(campaigns)

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
    ("keywords", "rev_associated_with", "campaign"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),  
    ("platform", "optimized_for", "keywords"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),  
    ("campaign", "managed_by", "network"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),  
    ("campaign", "belongs_to", "advertiser"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),  
    ("campaign", "targeted_with", "search_tag"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),  
    ("search_tag", "rev_targeted_with", "campaign"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),
    ("campaign", "targeted_in", "region"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),  
    ("campaign", "uses", "currency"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long)  
}

# Load pre-trained GloVe embeddings
def load_glove_embeddings(glove_path):
    embeddings_index = {}
    with open(glove_path, "r", encoding="utf-8") as f:
        for line in f:
            values = line.split()
            word = values[0]
            coefs = np.asarray(values[1:], dtype="float32")
            embeddings_index[word] = coefs
    print(f"Loaded {len(embeddings_index)} word vectors.")
    return embeddings_index

# Convert text to embedding
def get_text_embedding(text_list, embeddings_index, embedding_dim=50):
    """Convert a list of words to an averaged embedding vector."""
    if not isinstance(text_list, list):
        text_list = [text_list]  # Ensure it's a list
    
    text = " ".join(text_list)  # Convert list to a single string
    words = text.lower().split()
    
    embeddings = [embeddings_index.get(word, np.zeros(embedding_dim)) for word in words]
    return np.mean(embeddings, axis=0).tolist() if embeddings else np.zeros(embedding_dim).tolist()

# Load GloVe embeddings
embeddings_index = load_glove_embeddings(glove_path)

# Define a reverse mapping for region one-hot encoding
region_reverse_mapping = {
    (1, 0, 0, 0, 0, 0, 0): "Asia/Kolkata",
    (0, 1, 0, 0, 0, 0, 0): "Africa/Cairo",
    (0, 0, 1, 0, 0, 0, 0): "Asia/Calcutta",
    (0, 0, 0, 1, 0, 0, 0): "America/New_York",
    (0, 0, 0, 0, 1, 0, 0): "Asia/Singapore",
    (0, 0, 0, 0, 0, 1, 0): "US/Eastern",
    (0, 0, 0, 0, 0, 0, 1): "Asia/Muscat"
}

def get_currency_one_hot(region):
    """Maps region (timezone) to a one-hot encoded currency vector."""
    currency_mapping = {
        "Asia/Kolkata": [1, 0, 0, 0, 0],  # AED
        "Asia/Calcutta": [1, 0, 0, 0, 0],  # AED
        "Africa/Cairo": [0, 1, 0, 0, 0],   # EGP
        "Asia/Singapore": [0, 0, 1, 0, 0], # SGD
        "America/New_York": [0, 0, 0, 1, 0],  # USD
        "US/Eastern": [0, 0, 0, 1, 0],     # USD
        "Asia/Muscat": [0, 0, 0, 1, 0],    # USD
        "Asia/Dubai": [0, 0, 0, 1, 0],     # USD
    }
    return torch.tensor(currency_mapping.get(region, [0, 0, 0, 0, 1]), dtype=torch.float)  
    # Default to [0, 0, 0, 0, 1] if region not found



@engagement_bp.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Extract and transform inputs
        keywords_emb = get_text_embedding(data.get("keywords", []), embeddings_index)
        search_tag_emb = get_text_embedding(data.get("searchTags", []), embeddings_index)
        advertiser_emb = get_text_embedding(data.get("advertiser", []), embeddings_index)

        duration = data["duration"]
        budget = data["budget"]

        region_one_hot = tuple(data.get("region", [0, 0, 0, 0, 0, 0, 1]))  # Convert list to tuple for lookup

        # Get region name from the one-hot encoding
        region_name = region_reverse_mapping.get(region_one_hot, "Unknown")

        # Get currency one-hot encoding based on region name
        currency_code = get_currency_one_hot(region_name)

        # Manually setting these values since they aren't coming from frontend
        campaign = [158] 
        network_id = 353 
        template_id = 90 

        # Combine campaign and duration into a single tensor
        campaign_with_duration = torch.tensor(campaign + duration + budget, dtype=torch.float)
        
        # Convert all inputs to tensors
        test_input = {
            "campaign": campaign_with_duration,
            "network": torch.tensor([network_id], dtype=torch.float),
            "template": torch.tensor([template_id], dtype=torch.float),
            "platform": torch.tensor(data["platform"], dtype=torch.float),
            "channel": torch.tensor(data["channel"], dtype=torch.float),
            "keywords": torch.tensor(keywords_emb, dtype=torch.float),
            "advertiser": torch.tensor(advertiser_emb, dtype=torch.float),
            "search_tag": torch.tensor(search_tag_emb, dtype=torch.float),
            "creative": torch.tensor(data["creative"], dtype=torch.float),
            "region": torch.tensor(data["region"], dtype=torch.float),  # Keep original region one-hot
            "currency": currency_code,  # Use the mapped currency one-hot

        }

        # Convert all tensors to 2D by adding an extra dimension
        input_data = {key: tensor.unsqueeze(0) if tensor.dim() == 1 else tensor for key, tensor in test_input.items()}

        # Get model prediction
        with torch.no_grad():
            output = model(input_data, edge_index_dict)

        # Convert output to percentage
        percentage_output = round(output.squeeze().item() * 100, 2)

        # Format response
        response = {"prediction": f"{percentage_output} %"}
        print(response)
        return jsonify(response)

    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 400
    


