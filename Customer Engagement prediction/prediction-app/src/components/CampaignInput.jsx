import React from "react";

const CampaignInputs = ({ handleInputChange, formData }) => {
    return (
        <div>
            <label htmlFor="campaignId">Campaign ID:</label>
            <input
                type="number"
                id="campaignId"
                placeholder="e.g., 30"
                value={formData?.campaignId || ""}
                onChange={handleInputChange}
                min="0"
            />
        </div>
    );
};

export default CampaignInputs;
