import React, { useState } from "react";
import PlatformSelection from "./components/PlatformSelection";
import ChannelSelection from "./components/ChannelSelection";
import CreativeSelection from "./components/CreativeSelection";
import TemplateSelection from "./components/TemplateSelection";
import KeywordsInput from "./components/keywordsInput";
import AdvertiserInput from "./components/AdvertiserInput";
import NumberOfDaysInput from "./components/NumberOfDaysInput";
import CampaignInputs from "./components/CampaignInput";
import NetworkSelection from "./components/NetworkInput";
import "./App.css";

const optionsConfig = {
  platform: ["DV360", "Facebook Ads", "Google Ads"],
  channel: ["Display", "Mobile", "Search", "Social"],
  creative: ["1500", "0"],
  template: ["90", "23", "92", "89", "93"],
  network: ["190", "287", "191", "188", "353", "350"]
};

const App = () => {
  const [formData, setFormData] = useState({
    platform: [0, 0, 0],
    channel: [0, 0, 0, 0],
    creative: [0, 0],
    template: [0, 0, 0, 0, 0],
    network: [0, 0, 0, 0, 0, 0],
    keywords: "",
    advertiser: "",
    numberOfDays: "",
    campaignId: "",

  });

  const [successMessage, setSuccessMessage] = useState("");
  const [receivedData, setReceivedData] = useState(null);
  

  const handleSelectChange = (e) => {
    const { id, value } = e.target;

    if (optionsConfig[id]) {
      const oneHotArray = optionsConfig[id].map((_, index) =>
        index === parseInt(value) ? 1 : 0
      );
      setFormData((prev) => ({ ...prev, [id]: oneHotArray }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Function to send form data to the backend
  const submitForm = async () => {
    try {
      const response = await fetch('http://localhost:5000/test-predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data sent successfully:", data);

      setSuccessMessage("Data sent successfully! Embeddings generated.");
    } catch (error) {
      console.error('Error sending data:', error);
      setSuccessMessage("Failed to send data. Please try again.");
    }
  };





  return (
    <div className="main-container">
      <div className="form-container">
        <h2>Customer Engagement Prediction</h2>
        <div className="form-grid">
          <PlatformSelection formData={formData} handleSelectChange={handleSelectChange} />
          <ChannelSelection formData={formData} handleSelectChange={handleSelectChange} />
          <CreativeSelection formData={formData} handleSelectChange={handleSelectChange} />
          <TemplateSelection formData={formData} handleSelectChange={handleSelectChange} />
          <NetworkSelection formData={formData} handleSelectChange={handleSelectChange} />
          <CampaignInputs formData={formData} handleInputChange={handleInputChange} />
          <KeywordsInput formData={formData} handleInputChange={handleInputChange} />
          <AdvertiserInput formData={formData} handleInputChange={handleInputChange} />
          <NumberOfDaysInput formData={formData} handleInputChange={handleInputChange} />
        </div>
        <button onClick={submitForm}>Send Data to Backend</button>
        {successMessage && <p>{successMessage}</p>}
      </div>

      <div className="output-container">
        <h3>Generated JSON Output:</h3>
        <pre>{JSON.stringify(formData, null, 2)}</pre>

        {receivedData && (
          <div>
            <h3>Received Data from Backend:</h3>
            <pre>{JSON.stringify(receivedData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
