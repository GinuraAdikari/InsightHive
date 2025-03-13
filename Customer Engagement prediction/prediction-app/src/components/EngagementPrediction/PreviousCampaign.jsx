import React from "react";
import "./styles/PreviousCampaign.css"; // You can add styling here as needed.

const PreviousCampaign = ({ previousCampaign }) => {
  return (
    <div className="previous-campaign-container">
      <h2>Previous Campaign</h2>
      {previousCampaign ? (
        <div className="previous-campaign-info">
          <p><strong>Platform:</strong> {previousCampaign.platform}</p>
          <p><strong>Channel:</strong> {previousCampaign.channel}</p>
          <p><strong>Keywords:</strong> {previousCampaign.keywords.join(", ")}</p>
          <p><strong>Search Tags:</strong> {previousCampaign.search_tags.join(", ")}</p>
          <p><strong>Duration:</strong> {previousCampaign.duration} days</p>
          <p><strong>Budget:</strong> ${previousCampaign.budget}</p>
          <p><strong>Creative Available:</strong> {previousCampaign.creative ? "Yes" : "No"}</p>
          <p><strong>Engagement Level:</strong> {previousCampaign.engagementLevel}</p>
        </div>
      ) : (
        <p>No previous campaign data available.</p>
      )}
    </div>
  );
};

export default PreviousCampaign;
