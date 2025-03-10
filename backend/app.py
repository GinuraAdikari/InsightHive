from flask import Flask, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import torch
from torch_geometric.nn import MetaPath2Vec
from sklearn.preprocessing import normalize


# Load the graph data
data = torch.load("graph_data.pth")
print("Graph data loaded successfully!")

metapath = [
    ('visitor', 'purchases', 'item'),
    ('item', 'belongs_to', 'category'),
    ('category', 'rev_belongs_to', 'item'),  # Reverse direction to continue
    ('item', 'rev_purchases', 'visitor')     # Reverse direction back to visitor
]


app = Flask(__name__)

model = MetaPath2Vec(
    data.edge_index_dict,
    embedding_dim=128,
    metapath=metapath,
    walk_length=5,
    context_size=3,
    walks_per_node=5,
    num_negative_samples=5,
    sparse=True
).to('cpu')

model.load_state_dict(torch.load("metapath2vec_model.pth"))
model.eval()

embeddings = np.load("visitor_embeddings.npy", allow_pickle=True).item()

# Load training data
train_data_encoded = np.load("train_data_encoded.npy", allow_pickle=True).item()


def recommend(visitor_id, top_k=5, weight_purchases=2.0, weight_views=0.5):
    if visitor_id not in embeddings:
        return []

    visitor_embedding = embeddings[visitor_id].reshape(1, -1)

    # Compute similarity between visitor and all items
    item_embeddings = model('item').detach().cpu().numpy()
    item_embeddings = normalize(item_embeddings)
    similarities = cosine_similarity(visitor_embedding, item_embeddings)[0]

    # Assign higher weights to "purchase" interactions
    item_ids = np.arange(len(item_embeddings))
    purchase_mask = (train_data_encoded['visitorid_encoded'] == visitor_id) & \
                    (train_data_encoded['event'] == 'transaction')

    view_mask = (train_data_encoded['visitorid_encoded'] == visitor_id) & \
                (train_data_encoded['event'] == 'view')

    purchased_items = train_data_encoded[purchase_mask]['itemid_encoded'].values
    viewed_items = train_data_encoded[view_mask]['itemid_encoded'].values

    # Apply weights
    for item in purchased_items:
        similarities[item] *= weight_purchases
    for item in viewed_items:
        similarities[item] *= weight_views

    # Get top-k recommendations
    top_indices = similarities.argsort()[-top_k:][::-1]
    return top_indices.tolist()


@app.route('/recommend', methods=['GET'])
def get_recommendations():
    visitor_id = request.args.get('visitor_id', type=int)

    if visitor_id is None:
        return jsonify({'error': 'visitor_id is required'}), 400

    recommendations = recommend(visitor_id)
    return jsonify({'visitor_id': visitor_id, 'recommendations': recommendations})


if __name__ == '__main__':
    app.run(debug=True)
