import React, { useState } from "react";
import RecommendationGrid from "./components/RecommendationGrid";
import PurchaseProbabilityDisplay from "./components/PurchaseProbabilityDisplay";
import "./styles/newStyles.css";


const App = () => {
  const [visitorId, setVisitorId] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [purchaseProbability, setPurchaseProbability] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    if (!visitorId.trim()) {
      alert("Please enter a valid visitor ID.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/recommendation/${visitorId}`);
      const data = await response.json();

      console.log("API Response:", data);

      if (!data.recommendations) {
        throw new Error("Invalid API response format");
      }

      setRecommendations(data.recommendations);
      setPurchaseProbability(data.purchase_probability);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="recommendation-body">
        <h1 className="title">AI-Powered Recommendations</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter Visitor ID"
            value={visitorId}
            onChange={(e) => setVisitorId(e.target.value)}
            className="input-field"
          />
          <button 
            onClick={fetchRecommendations} 
            disabled={loading} 
            className="action-button"
          >
            {loading ? "Loading..." : "Get Recommendations"}
          </button>
        </div>
        <RecommendationGrid recommendations={recommendations} />
      </div>
      <PurchaseProbabilityDisplay probability={purchaseProbability} />
    </div>
  );
};

export default App;
