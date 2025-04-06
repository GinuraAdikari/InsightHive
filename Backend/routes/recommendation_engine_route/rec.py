import torch
import joblib
import pickle
import numpy as np
import pandas as pd
from flask import Blueprint, jsonify
from flask_cors import CORS
from torch_geometric.data import Data
import os
from sklearn.pipeline import Pipeline

# Import SRGNN model (Ensure the SRGNN model class is defined elsewhere and imported)
from models.srgnn import SRGNN

# Create a Blueprint for the recommendation API
rec_bp = Blueprint('rec', __name__)
CORS(rec_bp, resources={r"/recommend/*": {"origins": "http://localhost:3000"}})

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define paths
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, '../../models/recommendation_engine_model/srgnn_model.pth')
purchase_model_path = os.path.join(current_dir, '../../models/recommendation_engine_model/purchasing_probability_model.pkl')
data_path = os.path.join(current_dir, '../../models/recommendation_engine_model/df.csv')
train_data_path = os.path.join(current_dir, '../../models/recommendation_engine_model/train.txt')
val_data_path = os.path.join(current_dir, '../../models/recommendation_engine_model/val.txt')
test_data_path = os.path.join(current_dir, '../../models/recommendation_engine_model/test.txt')

# Load the trained SRGNN model
args = {
    'batch_size': 128,
    'hidden_dim': 64,
    'epochs': 10,
    'l2_penalty': 0.0001,
    'weight_decay': 0.1,
    'step': 5,
    'lr': 0.001,
    'num_items': 466868}

class objectview(object):
    def __init__(self, d):
        self.__dict__ = d

args = objectview(args)
model = SRGNN(args.hidden_dim, args.num_items).to(device)
model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()

# Load session-based graph data
with open(train_data_path, 'rb') as f:
    train_sessions = pickle.load(f)
with open(val_data_path, 'rb') as f:
    val_sessions = pickle.load(f)
with open(test_data_path, 'rb') as f:
    test_sessions = pickle.load(f)

all_sessions = train_sessions + val_sessions + test_sessions

# Load the trained purchase rate prediction model
purchase_model = joblib.load(purchase_model_path)

# Load dataset for purchase rate prediction
all_data = pd.read_csv(data_path)

def generate_recommendations(visitor_id, sessions, model, top_k=5):
    user_sessions = [session for session in sessions if session[0] == visitor_id]
    if not user_sessions:
        return []

    recommendations = []
    for session in user_sessions:
        if len(session) < 1:
            continue
        session_data = np.array(session[1:])

        # Convert session to graph
        codes, uniques = pd.factorize(session_data)
        senders, receivers = codes[:-1], codes[1:]
        if len(senders) == 0 or len(receivers) == 0:
            continue

        edge_index = torch.tensor(np.array([senders, receivers]), dtype=torch.long).to(device)
        x = torch.tensor(codes, dtype=torch.long).unsqueeze(1).to(device)
        batch = torch.zeros(len(codes), dtype=torch.long).to(device)

        data = Data(x=x, edge_index=edge_index, batch=batch)

        with torch.no_grad():
            output = model(data)
            if output.numel() < top_k:
                top_k = output.numel()
            top_items = torch.topk(output.squeeze(), top_k).indices.tolist()
            recommendations.extend(top_items)

    return list(set(recommendations))[:top_k]

def predict_purchasing_probability(visitorid, model_pipeline, data):
    visitor_data = data[data['visitorid'] == visitorid]
    if visitor_data.empty:
        print(f"Visitor ID {visitorid} not found in the dataset.")
        return 0  # Default probability if visitor is not found

    visitor_data = visitor_data.drop(['visitorid', 'view_count', 'purchased'], axis=1)
    X_visitor = visitor_data.drop(['purchase_rate'], axis=1)
    purchasing_probability = model_pipeline.predict(X_visitor)
    return purchasing_probability[0] * 100  # Convert to percentage

@rec_bp.route('/<int:visitor_id>', methods=['GET'])
def get_recommendations(visitor_id):
    if visitor_id is None:
        return jsonify({'error': 'visitor_id is required'}), 400

    recommendations = generate_recommendations(visitor_id, all_sessions, model, top_k=5)
    purchase_probability = predict_purchasing_probability(visitor_id, purchase_model, all_data)
    
    return jsonify({
        'visitor_id': visitor_id,
        'recommendations': recommendations,
        'purchase_probability': f"{purchase_probability:.2f}%"
    })
