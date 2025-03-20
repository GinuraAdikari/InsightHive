import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./styles/PreviousCampaign.css";

const ITEMS_PER_PAGE = 30; // Max time points shown in the chart at once

const PreviousCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [allEngagements, setAllEngagements] = useState([]);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0); // Tracks chart pagination
  const [selectedCampaignDetails, setSelectedCampaignDetails] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/previous-campaigns")
      .then((response) => response.json())
      .then((data) => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const uniqueIndexes = [...new Set(campaigns.map((c) => c.campaign_index))];

  const handleSelectChange = (event) => {
    const selectedCampaignIndex = Number(event.target.value);
    setSelectedIndex(selectedCampaignIndex);
    setSelectedCampaignDetails(null);
    setVisibleStartIndex(0); // Reset chart pagination

    const selectedCampaign = campaigns.filter((c) => c.campaign_index === selectedCampaignIndex);
    if (selectedCampaign.length > 0) {
      const sortedEngagements = selectedCampaign
        .map((c) => ({
          time: c.time,
          engagement_percentage: c.engagement_percentage,
        }))
        .sort((a, b) => new Date(a.time) - new Date(b.time)); // Sort by time
      setAllEngagements(sortedEngagements);
    }
  };

  const handlePointClick = (data) => {
    if (!data || selectedIndex === null) return;

    const campaignDetails = campaigns.find(
      (c) => c.campaign_index === selectedIndex && c.engagement_percentage === data.engagement_percentage
    );

    if (campaignDetails) {
      setSelectedCampaignDetails({
        no_of_days: campaignDetails.no_of_days,
        search_tags: campaignDetails.search_tags,
        advertiser_name: campaignDetails.advertiser_name,
        channel_name: campaignDetails.channel_name,
        campaign_budget_usd: campaignDetails.campaign_budget_usd,
        currency_code: campaignDetails.currency_code,
        search_tag_cat: campaignDetails.search_tag_cat,
        timezone: campaignDetails.timezone,
        keywords: campaignDetails.keywords,
        has_image: campaignDetails.has_image,
        campaign_index: campaignDetails.campaign_index,
        platform: campaignDetails.platform,
        engagement_percentage: campaignDetails.engagement_percentage,
      });
    }
  };

  // Get the current batch of 30 time points for the line chart
  const visibleEngagements = allEngagements.slice(visibleStartIndex, visibleStartIndex + ITEMS_PER_PAGE);

  const handleNextBatch = () => {
    if (visibleStartIndex + ITEMS_PER_PAGE < allEngagements.length) {
      setVisibleStartIndex(visibleStartIndex + ITEMS_PER_PAGE);
    }
  };

  const handlePrevBatch = () => {
    if (visibleStartIndex - ITEMS_PER_PAGE >= 0) {
      setVisibleStartIndex(visibleStartIndex - ITEMS_PER_PAGE);
    }
  };

  return (
    <div className="previous-campaign-container">
      <h2> Analyse Previous Campaigns Engagements</h2>

      <div className="dropdown-container">
        <div className="campaign-selection">
          <label>Select Campaign:</label>
          <select onChange={handleSelectChange} className="campaign-dropdown">
            <option value="">-- Choose --</option>
            {uniqueIndexes.map((index) => (
              <option key={index} value={index}>
                Campaign {index}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : campaigns.length > 0 ? (
        <>
          {selectedIndex !== null && (
            <div className="campaign-content">
              <div className="chart-wrapper">
                <div className="chart-navigation">
                  <div className="title-dir-buttons">
                    <h3>Engagement Trends</h3>
                    {/* Buttons grouped on the right */}
                    <div className="button-group">
                      <button onClick={handlePrevBatch} disabled={visibleStartIndex === 0}>&lt;</button>
                      <button onClick={handleNextBatch} disabled={visibleStartIndex + ITEMS_PER_PAGE >= allEngagements.length}>
                        &gt;
                      </button>
                    </div>
                  </div>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={visibleEngagements}
                        margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                        onClick={(e) => handlePointClick(e.activePayload?.[0]?.payload)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" angle={-30} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="engagement_percentage" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="details-wrapper">
                {selectedCampaignDetails ? (
                  <>
                    <h3>Campaign Details</h3>
                    <div className="details-container">
                      <p><strong>No. of Days:</strong> {selectedCampaignDetails.no_of_days}</p>
                      <p><strong>Search Tags:</strong> {selectedCampaignDetails.search_tags}</p>
                      <p><strong>Advertiser:</strong> {selectedCampaignDetails.advertiser_name}</p>
                      <p><strong>Channel:</strong> {selectedCampaignDetails.channel_name}</p>
                      <p><strong>Budget:</strong> ${selectedCampaignDetails.campaign_budget_usd} {selectedCampaignDetails.currency_code}</p>
                      <p><strong>Search Tag Category:</strong> {selectedCampaignDetails.search_tag_cat}</p>
                      <p><strong>Timezone:</strong> {selectedCampaignDetails.timezone}</p>
                      <p><strong>Keywords:</strong> {selectedCampaignDetails.keywords}</p>
                      <p><strong>Has Image:</strong> {selectedCampaignDetails.has_image}</p>
                      <p><strong>Campaign Index:</strong> {selectedCampaignDetails.campaign_index}</p>
                      <p><strong>Platform:</strong> {selectedCampaignDetails.platform}</p>
                      <p><strong>Engagement:</strong> {selectedCampaignDetails.engagement_percentage}</p>
                    </div>
                  </>
                ) : (
                  <p>Select a campaign point to see details.</p>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <p>No previous campaign data available.</p>
      )}
    </div>
  );
};

export default PreviousCampaign;
