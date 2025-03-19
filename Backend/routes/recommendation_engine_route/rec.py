# routes/rec.py
from flask import Blueprint, jsonify
from flask_cors import CORS
import numpy as np
import torch
from torch_geometric.data.storage import BaseStorage
from torch_geometric.nn import MetaPath2Vec
from sklearn.preprocessing import normalize
from sklearn.metrics.pairwise import cosine_similarity
import os

# Create a Blueprint for the recommendation API
rec_bp = Blueprint('rec', __name__)

# Enable CORS for this Blueprint
CORS(rec_bp, resources={r"/recommend/*": {"origins": "http://localhost:5173"}})

current_dir = os.path.dirname(os.path.abspath(__file__))
train_data_path = os.path.join(current_dir, '../../models/recommendation_engine_model/train_data_encoded.npy')
embeddings_path = os.path.join(current_dir, '../../models/recommendation_engine_model/visitor_embeddings.npy')
graph_data_path = os.path.join(current_dir, '../../models/recommendation_engine_model/graph_data.pth')
model_path = os.path.join(current_dir, '../../models/recommendation_engine_model/metapath2vec_model.pth')

# Load pre-trained data
train_data_encoded = np.load(train_data_path, allow_pickle=True).item()
embeddings = np.load(embeddings_path, allow_pickle=True).item()

torch.serialization.add_safe_globals([BaseStorage])

# Load trained model
data = torch.load(graph_data_path, weights_only=False)
model = MetaPath2Vec(
    data.edge_index_dict,
    embedding_dim=128,
    metapath=[
        ('visitor', 'purchases', 'item'),
        ('item', 'belongs_to', 'category'),
        ('category', 'rev_belongs_to', 'item'),
        ('item', 'rev_purchases', 'visitor')
    ],
    walk_length=5,
    context_size=3,
    walks_per_node=5,
    num_negative_samples=5,
    sparse=True
).to('cpu')

model.load_state_dict(torch.load(model_path))
model.eval()

@rec_bp.route('/<int:visitor_id>', methods=['GET'])
def get_recommendations(visitor_id):
    if visitor_id is None:
        return jsonify({'error': 'visitor_id is required'}), 400

    if visitor_id not in embeddings:
        return jsonify({'visitor_id': visitor_id, 'recommendations': []})

    visitor_embedding = embeddings[visitor_id].reshape(1, -1)
    item_embeddings = model('item').detach().cpu().numpy()
    item_embeddings = normalize(item_embeddings)

    similarities = cosine_similarity(visitor_embedding, item_embeddings)[0]
    top_indices = similarities.argsort()[-5:][::-1]

    return jsonify({'visitor_id': visitor_id, 'recommendations': top_indices.tolist()})

@rec_bp.route("/items", methods=['GET'])
def get_items():
    return jsonify({'items': list(train_data_encoded['item'])})