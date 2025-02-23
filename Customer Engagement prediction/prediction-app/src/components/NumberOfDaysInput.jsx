import React from "react";

const NumberOfDaysInput = ({ handleInputChange, formData }) => {

    return (
        <div>
            <label htmlFor="numberOfDays">Number of Days:</label>
            <input
                type="number"
                id="numberOfDays"
                placeholder="e.g., 30"
                value={formData?.numberOfDays || ""}
                onChange={handleInputChange}
                min="0"
            />
        </div>
    );
};

export default NumberOfDaysInput;
