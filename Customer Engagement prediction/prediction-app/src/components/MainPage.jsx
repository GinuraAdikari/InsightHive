// src/components/MainPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainPage.css";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <h1>Insight Hive</h1>
      <div className="feature-buttons">
        <button className="bg-blue" onClick={() => navigate("/engagement-prediction")}>
          Engagement Prediction
        </button>
        <button className="bg-green" onClick={() => navigate("/customer-segmentation")}>
          Customer Segmentation
        </button>
        <button className="bg-yellow" onClick={() => navigate("/sentiment-analysis")}>
          Sentiment Analysis
        </button>
        <button className="bg-purple" onClick={() => navigate("/recommendation-engine")}>
          Recommendation Engine
        </button>
      </div>
    </div>
  );
};

export default MainPage;
