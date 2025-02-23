import React from "react";

const CreativeSelection = ({ formData, handleSelectChange }) => (
    <div>
        <label htmlFor="creative">Creative:</label>
        <select id="creative" onChange={handleSelectChange}>
            <option value="">Select Creative</option>
            {["1500", "0"].map((option, index) => (
                <option key={index} value={index}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

export default CreativeSelection;
