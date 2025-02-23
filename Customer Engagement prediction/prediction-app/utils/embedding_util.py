import numpy as np


import os

current_directory = os.getcwd()
print("Current Working Directory:", current_directory)
# Load pre-trained GloVe embeddings
glove_path = "Customer Engagement prediction/GloVe/glove.6B.50d.txt"  # Update the path if needed

def load_glove_embeddings(glove_file):
    """Loads GloVe embeddings from a file into a dictionary."""
    embeddings = {}
    with open(glove_file, "r", encoding="utf-8") as f:
        for line in f:
            values = line.split()
            word = values[0]
            vector = np.array(values[1:], dtype=np.float32)
            embeddings[word] = vector
    return embeddings

# Load GloVe embeddings once during the application startup
glove_embeddings = load_glove_embeddings(glove_path)


def get_phrase_embedding(phrase):
    """Converts a phrase into a GloVe embedding by averaging word vectors."""
    if not phrase:
        return np.zeros(50)  # Return a NumPy array of zeros for empty input
    
    words = phrase.split()
    vectors = [glove_embeddings[word] for word in words if word in glove_embeddings]
    if vectors:
        # Ensure that the result is a NumPy array by not using .tolist()
        return np.mean(vectors, axis=0)  # np.mean already returns a NumPy array
    else:
        return np.zeros(50)  # Return a NumPy array of zeros if no words match

