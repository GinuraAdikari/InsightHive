import React from "react";

const TemplateSelection = ({ formData, handleSelectChange }) => (
    <div>
        <label htmlFor="template">Template:</label>
        <select id="template" onChange={handleSelectChange}>
            <option value="">Select Template</option>
            {["90", "23", "92", "89", "93"].map((option, index) => (
                <option key={index} value={index}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

export default TemplateSelection;
