import React, { useState } from "react";
import "./EngagementPrediction.css";

const EngagementPrediction = () => {
  const [formData, setFormData] = useState({
    platform: "",
    channel: "",
    campaignObjective: "",
    keywords: "",
    searchTags: "",
    budget: "",
    duration: "",
    isAvailable: false,
  });

  const [output, setOutput] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");  // State for storing the message from Flask
  const [errorMessage, setErrorMessage] = useState("");  // State for storing validation error message

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check for all required fields
    if (!formData.platform || !formData.channel || !formData.campaignObjective || !formData.keywords || !formData.searchTags || !formData.budget || !formData.duration) {
      setErrorMessage("Please fill all the fields.");
      return;  // Exit if validation fails
    }

    setErrorMessage("");  // Clear error message if all fields are filled

    const getOneHotEncoded = (value, options) =>
      options.map((option) => (option === value ? 1 : 0));

    const outputData = {
      platform: getOneHotEncoded(formData.platform, ["DV360", "Facebook Ads", "Google Ads"]),
      channel: getOneHotEncoded(formData.channel, ["Mobile", "Search", "Social", "Video"]),
      campaignObjective: getOneHotEncoded(formData.campaignObjective, ["Brand Awareness", "Lead Generation", "Conversions"]),
      keywords: formData.keywords.split(",").map((kw) => kw.trim()),
      searchTags: formData.searchTags.split(",").map((tag) => tag.trim()),
      budget: [Number(formData.budget)],
      duration: [Number(formData.duration)],
      hasimage: [formData.isAvailable ? 1 : 0],
    };

    console.log("Form Output:", outputData);
    setOutput(outputData);

    // Sending the data to the Flask API
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
        setResponseMessage(`Response Message: ${data.message}`);  // Displaying the message returned from Flask
        setOutput(data.receivedData);  // Display the data received from the API
      } else {
        setResponseMessage("Error in API call");
      }
    } catch (error) {
      setResponseMessage("Error: " + error.message);
    }
  };

  return (
    <div className="engagement-container">
      <h1 className="engagement-title">Customer Engagement Prediction</h1>
      <p className="engagement-description">
        Predict your future customer engagement level for the advertisement you are about to post!
        Enhance your marketing strategy with data-driven insights.
      </p>
      <div className="form-output-wrapper">
        <form className="engagement-form" onSubmit={handleSubmit}>
          <label>
            Platform:
            <select name="platform" value={formData.platform} onChange={handleChange} className="animated-input">
              <option value="">Select a platform</option>
              <option value="DV360">DV360</option>
              <option value="Facebook Ads">Facebook Ads</option>
              <option value="Google Ads">Google Ads</option>
            </select>
          </label>

          <label>
            Channel Type:
            <select name="channel" value={formData.channel} onChange={handleChange} className="animated-input">
              <option value="">Select channel type</option>
              <option value="Mobile">Mobile</option>
              <option value="Search">Search</option>
              <option value="Social">Social</option>
              <option value="Video">Video</option>
            </select>
          </label>

          <label>
            Campaign Objective:
            <select name="campaignObjective" value={formData.campaignObjective} onChange={handleChange} className="animated-input">
              <option value="">Select objective</option>
              <option value="Brand Awareness">Brand Awareness</option>
              <option value="Lead Generation">Lead Generation</option>
              <option value="Conversions">Conversions</option>
            </select>
          </label>

          <label>
            Keywords:
            <textarea
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="Enter keywords separated by commas"
              className="animated-input"
            />
          </label>

          <label>
            Search Tags:
            <textarea
              name="searchTags"
              value={formData.searchTags}
              onChange={handleChange}
              placeholder="Enter search tags separated by commas"
              className="animated-input"
            />
          </label>

          <label>
            Budget (USD):
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter your budget"
              className="animated-input"
            />
          </label>

          <label>
            Duration (Days):
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter campaign duration"
              className="animated-input"
            />
          </label>

          <label>
            Does it have an Image for the ad?
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />
              </label>
            </div>
          </label>

          {errorMessage && <p className="error-message">{errorMessage}</p>}  {/* Show error message if validation fails */}

          <button type="submit" className="submit-button">Submit</button>
        </form>

        <div className="output-container">
          <h2 className="output-title">Engagement Prediction Result</h2>
          {responseMessage ? (
            <p className="output-content">{responseMessage}</p>  // Display the message returned from Flask
          ) : (
            <p className="placeholder-text">Output will be displayed here upon submission.</p>
          )}

          {output && (
            <pre className="output-content">{JSON.stringify(output, null, 2)}</pre>  // Display the received data
          )}
        </div>
      </div>
    </div>
  );
};

export default EngagementPrediction;
