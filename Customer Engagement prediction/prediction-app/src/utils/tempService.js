import axios from 'axios';

// Set your Flask API base URL
const BASE_URL = 'http://localhost:5000';

/**
 * Fetch embeddings for the provided keywords from the Flask backend.
 * @param {string} keywords - The keywords to embed.
 * @returns {Promise<Object>} - The embedding response.
 */
export const fetchKeywordEmbedding = async (keywords) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/keyword-embedding`, { keywords });
        return response.data;
    } catch (error) {
        console.error('Error fetching keyword embedding:', error);
        throw error;
    }
};

/**
 * Send input data to the model prediction API.
 * @param {Object} inputData - The full input payload for prediction.
 * @returns {Promise<Object>} - The prediction response.
 */
export const fetchModelPrediction = async (inputData) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/predict`, inputData);
        return response.data;
    } catch (error) {
        console.error('Error fetching model prediction:', error);
        throw error;
    }
};
