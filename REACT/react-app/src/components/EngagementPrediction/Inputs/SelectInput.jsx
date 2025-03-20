import React from 'react';

const SelectInput = ({ name, label, value, onChange, options }) => {
  return (
    <label>
      {label}:
      <select name={name} value={value} onChange={onChange} className="animated-input">
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
};

export default SelectInput;
