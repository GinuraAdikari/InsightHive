import React from "react";

const ChannelSelection = ({ formData, handleSelectChange }) => (
    <div>
        <label htmlFor="channel">Channel:</label>
        <select id="channel" onChange={handleSelectChange}>
            <option value="">Select Channel</option>
            {["Display", "Mobile", "Search", "Social"].map((option, index) => (
                <option key={index} value={index}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

export default ChannelSelection;
