import React from "react";
import RecommendationItem from "./RecommendationItem";

const RecommendationGrid = ({ recommendations }) => {
  return (
    <div className="recommendation-grid">
      {recommendations.map((item, index) => (
        <RecommendationItem key={index} item={item} />
      ))}
    </div>
  );
};

export default RecommendationGrid;