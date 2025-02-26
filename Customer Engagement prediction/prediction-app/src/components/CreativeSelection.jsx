import React from "react";

const CreativeSelection = ({ formData, handleSelectChange }) => {
  return (
    <div className="creative-selection">
      <div>
        <label htmlFor="creative">Creative: Yes</label>
        <input
          type="radio"
          id="creative"
          name="creative"
          value="0"
          checked={formData.creative[0] === 1}
          onChange={handleSelectChange}
        />
      </div>
      <div>
        <label htmlFor="creative">No</label>
        <input
          type="radio"
          id="creative"
          name="creative"
          value="1"
          checked={formData.creative[1] === 1}
          onChange={handleSelectChange}
        />
      </div>
    </div>
  );
};

export default CreativeSelection;
