import numpy as np
import os

current_directory = os.getcwd()
print("Current Working Directory:", current_directory)
# Load pre-trained GloVe embeddings
glove_path = "Customer Engagement prediction/GloVe/glove.6B.50d.txt"  # Update the path if needed

# Load GloVe Embeddings
def load_glove_embeddings(filepath=glove_path):
    embeddings_index = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            values = line.split()
            word = values[0]
            coefs = np.asarray(values[1:], dtype='float32')
            embeddings_index[word] = coefs
    print("Loaded {} word vectors.".format(len(embeddings_index)))
    return embeddings_index

# Get Embeddings for a Given Text
def get_text_embedding(text, embeddings_index, embedding_dim=50):
    words = text.lower().split()
    embeddings = [embeddings_index.get(word, np.zeros(embedding_dim)) for word in words]
    
    if not embeddings:
        return np.zeros(embedding_dim)  # Return zero vector if no valid words found
    
    return np.mean(embeddings, axis=0)  # Average word embeddings

# Load embeddings when the module is imported
embeddings_index = load_glove_embeddings()
