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

@app.route('/store-data', methods=['POST'])
def store_data():
    global stored_data
    stored_data = request.json
    return jsonify({"message": "Data stored successfully"})

def get_text_embedding(text, embeddings_index):
    # Mock embedding generation for demonstration
    return np.random.rand(50).tolist()

embeddings_index = {}  # Initialize with GloVe embeddings if available

@app.route('/test-predict', methods=['GET'])
def test_predict():
    global stored_data

    # Automatically use stored data without requiring a request body
    if not stored_data:
        return jsonify({"error": "No stored data found. Please call /store-data first."}), 400
    
    # Extract data from the stored data
    campaign_id = stored_data.get('campaignId', "")
    platform = stored_data.get('platform', [])
    channel = stored_data.get('channel', [])
    creative = stored_data.get('creative', [])
    template = stored_data.get('template', [])
    network = stored_data.get('network', [])
    keywords_text = stored_data.get('keywords', "")
    advertiser_text = stored_data.get('advertiser', "")
    advertiser_id = stored_data.get('advertiserId', "")
    number_of_days = stored_data.get('numberOfDays', "")
    
    # Ensure that campaign_id and number_of_days are valid integers, defaulting to 0 if not
    try:
        campaign_id = int(campaign_id) if campaign_id else 0
        number_of_days = int(number_of_days) if number_of_days else 0
        advertiser_id = int(advertiser_id) if advertiser_id else 0

    except ValueError:
        return jsonify({"error": "Invalid data for campaignId or numberOfDays."}), 400
    
    # Generate embeddings for advertiser and keywords
    advertiser_embedding = get_text_embedding(advertiser_text, embeddings_index)
    keywords_embedding = get_text_embedding(keywords_text, embeddings_index)
    
    # Prepare the full response in the correct order
    response_data = {
        "campaignId": [campaign_id],  # Correct format for campaignId as list
        "platform": platform,
        "channel": channel,
        "creative": creative,
        "template": template,
        "network": network,
        "keywords": keywords_embedding,  # Assuming keywords_embedding is already an array-like structure
        "advertiserId": [advertiser_id],  # Correct format for advertiserId as lis
        "advertiser": advertiser_embedding,  # Assuming advertiser_embedding is already an array-like structure
        "numberOfDays": [number_of_days],  # Correct format for numberOfDays as list
    }

    # Return the response
    return jsonify(response_data)

@app.route("/predict", methods=["GET"])
def predict():
    global stored_data

    if not stored_data:
        return jsonify({"error": "No stored data found. Please call /store-data first."}), 400
    
    try:
        # Extract data from stored_data
        campaign_id = stored_data.get('campaignId', "")
        platform = stored_data.get('platform', [])
        channel = stored_data.get('channel', [])
        creative = stored_data.get('creative', [])
        template = stored_data.get('template', [])
        network = stored_data.get('network', [])
        keywords_text = stored_data.get('keywords', "")
        advertiser_id = stored_data.get('advertiserId', "")
        advertiser_text = stored_data.get('advertiser', "")
        number_of_days = stored_data.get('numberOfDays', "")
        
        # Ensure that campaign_id and number_of_days are valid integers
        try:
            campaign_id = int(campaign_id) if campaign_id else 0
            number_of_days = int(number_of_days) if number_of_days else 0
            advertiser_id = int(advertiser_id) if advertiser_id else 0
        except ValueError:
            return jsonify({"error": "Invalid data for campaignId or numberOfDays or advertiser_id."}), 400
        
        # Generate embeddings for advertiser and keywords
        advertiser_embedding = get_text_embedding(advertiser_text, embeddings_index)
        keywords_embedding = get_text_embedding(keywords_text, embeddings_index)
        
        # Ensure advertiser_embedding is a list and its length is 50
        if len(advertiser_embedding) != 50:
            return jsonify({"error": "Invalid advertiser embedding length. Expected length of 50."}), 400
        
        # Prepare the input data for the model
        campaign_tensor = torch.tensor([campaign_id, number_of_days], dtype=torch.float)
        platform_tensor = torch.tensor(platform, dtype=torch.float)
        channel_tensor = torch.tensor(channel, dtype=torch.float)
        creative_tensor = torch.tensor(creative, dtype=torch.float)
        template_tensor = torch.tensor(template, dtype=torch.float)
        network_tensor = torch.tensor(network, dtype=torch.float)
        keywords_tensor = torch.tensor(keywords_embedding, dtype=torch.float)
        advertiser_tensor = torch.tensor([advertiser_id] + advertiser_embedding, dtype=torch.float)

        # Print the shapes of each tensor
        print("Shape of campaign_tensor:", campaign_tensor.shape)
        print("Shape of platform_tensor:", platform_tensor.shape)
        print("Shape of channel_tensor:", channel_tensor.shape)
        print("Shape of creative_tensor:", creative_tensor.shape)
        print("Shape of template_tensor:", template_tensor.shape)
        print("Shape of network_tensor:", network_tensor.shape)
        print("Shape of keywords_tensor:", keywords_tensor.shape)
        print("Shape of advertiser_tensor:", advertiser_tensor.shape)

        # Prepare the input data for the model
        test_input = {
            "campaign": campaign_tensor,
            "platform": platform_tensor,
            "channel": channel_tensor,
            "creative": creative_tensor,
            "template": template_tensor,
            "network": network_tensor,
            "keywords": keywords_tensor,
            "advertiser": advertiser_tensor,
        }

        # Pass the prepared data to the model
        with torch.no_grad():
            output = model(test_input, edge_index_dict)

        return jsonify({"prediction": output.tolist()})

    except Exception as e:
        return jsonify({"error": str(e)}), 400




if __name__ == "__main__":
    app.run(debug=True)
