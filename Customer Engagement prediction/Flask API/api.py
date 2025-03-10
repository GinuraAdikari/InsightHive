from flask import Flask, jsonify, request
import torch
from model import HeteroGCN  # Import your trained model
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

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
    ("keywords", "rev_associated_with", "campaign"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),  
    ("platform", "optimized_for", "keywords"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),  
    ("campaign", "managed_by", "network"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),  
    ("campaign", "belongs_to", "advertiser"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),  
    ("campaign", "targeted_with", "search_tag"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long),  
    ("search_tag", "rev_targeted_with", "campaign"): torch.tensor([[0, 0], [0, 0]], dtype=torch.long)  
}

# Load pre-trained GloVe embeddings
def load_glove_embeddings(filepath="Customer Engagement prediction/GloVe/glove.6B.50d.txt"):
    embeddings_index = {}
    with open(filepath, "r", encoding="utf-8") as f:
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
embeddings_index = load_glove_embeddings()


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Extract and transform inputs
        keywords_emb = get_text_embedding(data.get("keywords", []), embeddings_index)
        search_tag_emb = get_text_embedding(data.get("searchTags", []), embeddings_index)
        advertiser_emb = get_text_embedding(data.get("advertiser", []), embeddings_index)

        duration = data["duration"]  # Duration data comes from the frontend

        # Manually setting these values since they aren't coming from frontend
        campaign = [158] 
        network_id = 290 
        template_id = 190 
        # Combine campaign and duration into a single tensor
        campaign_with_duration = torch.tensor(campaign + duration, dtype=torch.float)
        
        # Convert all inputs to tensors
        test_input = {
            "campaign": campaign_with_duration,  # Now both campaign and duration are together
            "network": torch.tensor([network_id], dtype=torch.float),
            "template": torch.tensor([template_id], dtype=torch.float),
            "platform": torch.tensor(data["platform"], dtype=torch.float),
            "channel": torch.tensor(data["channel"], dtype=torch.float),
            "keywords": torch.tensor(keywords_emb, dtype=torch.float),
            "advertiser": torch.tensor(advertiser_emb, dtype=torch.float),
            "search_tag": torch.tensor(search_tag_emb, dtype=torch.float),
            "creative": torch.tensor(data["creative"], dtype=torch.float),
        }

        # Convert all tensors to 2D by adding an extra dimension
        input_data = {key: tensor.unsqueeze(0) if tensor.dim() == 1 else tensor for key, tensor in test_input.items()}

        print("Test Input:", input_data)

        # Get model prediction
        with torch.no_grad():
            output = model(input_data, edge_index_dict)

        response = {"prediction": output.tolist()}
        return jsonify(response)
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 400
    

if __name__ == '__main__':
    app.run(debug=True)
