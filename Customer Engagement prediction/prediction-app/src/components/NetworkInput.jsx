import React from "react";

const NetworkSelection = ({ formData, handleSelectChange}) => (
    <div>
        <label htmlFor="network">Network:</label>
        <select id="network" onChange={handleSelectChange}>
            <option value="">Select a Network</option>
            {["189", "190", "287", "191", "188", "353", "350"].map((option, index) => (
                <option key={index} value={index}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);
   
export default NetworkSelection;
