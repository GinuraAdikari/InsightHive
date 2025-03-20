import React from 'react';

const CheckboxInput = ({ name, checked, onChange }) => {
  return (
    <label>
      Does it have an Image for the ad?
      <div className="checkbox-group">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
        />
      </div>
    </label>
  );
};

export default CheckboxInput;
