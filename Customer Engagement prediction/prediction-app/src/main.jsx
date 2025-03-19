// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import EngagementPrediction from "./components/EngagementPrediction/EngagementPrediction";
import CustomerSegmentation from "./components/CustomerSegmentation";
import SentimentAnalysis from "./components/SentimentAnalysis"; 
import RecommendationEngine from "./components/RecommendationEngine";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/engagement-prediction" element={<EngagementPrediction />} />
      <Route path="/customer-segmentation" element={<CustomerSegmentation />} />
      <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
      <Route path="/recommendation-engine" element={<RecommendationEngine />} />
    </Routes>
  </Router>
);
