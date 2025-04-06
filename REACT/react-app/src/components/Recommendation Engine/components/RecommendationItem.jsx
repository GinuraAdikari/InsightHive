import React from "react";

const RecommendationItem = ({ item }) => {
  return (
    <div className="recommendation-card">
      <h2 className="recommendation-title">Item ID: {item}</h2>
    </div>
  );
};

export default RecommendationItem;