import React from "react";

const PlatformSelection = ({ formData, handleSelectChange }) => (
    <div>
        <label htmlFor="platform">Platform:</label>
        <select id="platform" onChange={handleSelectChange}>
            <option value="">Select Platform</option>
            {["DV360", "Facebook Ads", "Google Ads"].map((option, index) => (
                <option key={index} value={index}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

export default PlatformSelection;
