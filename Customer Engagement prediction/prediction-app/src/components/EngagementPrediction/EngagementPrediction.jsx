import React, { useState } from "react";
import EngagementForm from "./EngagementForm";
import OutputSection from "./OutputSection";
import ErrorMessage from "./ErrorMessage";
import "./styles/EngagementPrediction.css";
import PreviousCampaign from "./PreviousCampaign"; // Import the new component


const EngagementPrediction = () => {
  const [formData, setFormData] = useState({
    platform: "",
    channel: "",
    keywords: "",
    advertiser: "",
    search_tags: "",
    duration: "",
    isAvailable: false,
    region: "",
    budget: ""
  });

  const [output,setOutput] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [previousCampaign, setPreviousCampaign] = useState({
    platform: "Facebook Ads",
    channel: "Social",
    keywords: ["e-commerce", "sale", "new products"],
    search_tags: ["discount", "promotion"],
    duration: 30,
    budget: 5000,
    creative: true,
    engagementLevel: "High"
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.platform || !formData.channel || !formData.advertiser ||
       !formData.keywords || !formData.search_tags || !formData.duration ||
        !formData.region || !formData.budget) {
      setErrorMessage("Please fill all the fields.");
      return;
    }

    setErrorMessage("");

    const getOneHotEncoded = (value, options) =>
      options.map((option) => (option === value ? 1 : 0));

    const outputData = {
      platform: getOneHotEncoded(formData.platform, ["DV360", "Facebook Ads", "Google Ads"]),
      channel: getOneHotEncoded(formData.channel, ["Mobile", "Search", "Social", "Video", "Display"]),
      region: getOneHotEncoded(formData.region, ["Africa/Cairo", "America/New_York", "Asia/Calcutta", "Asia/Kolkata", "Asia/Muscat", "Asia/Singapore", "US/Eastern"]),
      advertiser: formData.advertiser.split(",").map((ad) => ad.trim()),
      keywords: formData.keywords.split(",").map((kw) => kw.trim()),
      search_tags: formData.search_tags.split(",").map((tag) => tag.trim()),
      duration: [Number(formData.duration)],
      creative: [formData.isAvailable ? 1 : 0],
      budget: [Number(formData.budget)]
    };

    console.log("Form Output:", outputData);
    setOutput(outputData);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(outputData),
      });
      
      if (response.ok) {
        const data = await response.json();
        setResponseMessage(`Prediction: ${data.prediction[0]}`);
        setOutput(data.prediction[0]);
      } else {
        setResponseMessage("Error in API call");
      }
    } catch (error) {
      setResponseMessage("Error: " + error.message);
    }
  };

  return (
    <>
    <div className="engagement-container">
      <h1 className="engagement-title">Customer Engagement Prediction</h1>
      <p className="engagement-description">
        Predict your future customer engagement level for the advertisement you are about to post!
      </p>
      <div className="previous-campaign-wrapper">
        <PreviousCampaign previousCampaign={previousCampaign} />
      </div>

      <div className="form-output-wrapper">
      <div className="form-title">
        <p>Predict Your Engagement</p>
      </div>  
        <div className="input-section">
        <EngagementForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
          {errorMessage && <ErrorMessage message={errorMessage} />}
        </div>
        <div className="output-section">
          <OutputSection responseMessage={responseMessage} />
        </div>
      </div>
    </div>
    </>
  );
};

export default EngagementPrediction;
