import React from "react";

const SelectionForm = ({ formData, handleSelectChange }) => {
    const optionsConfig = {
        platform: ["DV360", "Facebook Ads", "Google Ads"],
        channel: ["Display", "Mobile", "Search", "Social"],
        creative: ["1500", "0"],
        template: ["90", "23", "92", "89", "93"]
    };

    return (
        <div>
            {Object.entries(optionsConfig).map(([key, options]) => (
                <div key={key}>
                    <label htmlFor={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </label>
                    <select id={key} onChange={handleSelectChange}>
                        <option value="">Select {key}</option>
                        {options.map((option, index) => (
                            <option key={index} value={index}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};

export default SelectionForm;
