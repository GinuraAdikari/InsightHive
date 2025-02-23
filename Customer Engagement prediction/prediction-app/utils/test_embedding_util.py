import numpy as np
from embedding_util import get_phrase_embedding

# Test Cases
def test_get_phrase_embedding():
    # Test with a simple phrase
    test_phrase = "data science"
    embedding = get_phrase_embedding(test_phrase)

    print("Embedding Output:", embedding)
    print("Type of Embedding:", type(embedding))
    
    # Check if the output is a numpy array
    assert isinstance(embedding, np.ndarray), "Output should be a numpy array"
    
    # Check if the embedding has the expected shape (50,)
    assert embedding.shape == (50,), f"Embedding should be of length 50, but got {embedding.shape}"
    
    # Check if the embedding is not all zeros (if words exist in GloVe)
    assert not np.all(embedding == 0), "Embedding should not be all zeros"
    
    # Test with an unknown phrase
    unknown_phrase = "asdkjhasdjkhasd"
    unknown_embedding = get_phrase_embedding(unknown_phrase)
    
    # The embedding for unknown words should be a zero vector
    assert np.all(unknown_embedding == 0), "Unknown words should return a zero vector"
    
    print("✅ All tests passed!")

# Run the test
if __name__ == "__main__":
    test_get_phrase_embedding()
