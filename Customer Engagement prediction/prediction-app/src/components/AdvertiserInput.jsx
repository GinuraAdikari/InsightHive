import React from "react";

const AdvertiserInput = ({ handleInputChange, formData }) => {
    return (
        <div>
            <label htmlFor="advertiser">Advertiser Name:</label>
            <input
                type="text"
                id="advertiser"
                placeholder="e.g. Brand, Web (city, country, state)"
                value={formData?.advertiser || ""} // Safe access with fallback
                onChange={handleInputChange}
            />
        </div>
    );
};

export default AdvertiserInput;
