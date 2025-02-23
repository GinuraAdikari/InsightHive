import React from "react";

const KeywordsInput = ({ handleInputChange, formData }) => {
    return (
        <div>
            <label htmlFor="keywords">Keywords:</label>
            <input
                type="text"
                id="keywords"
                placeholder="e.g., keyword1, keyword2, keyword3"
                value={formData?.keywords || ""}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default KeywordsInput;
