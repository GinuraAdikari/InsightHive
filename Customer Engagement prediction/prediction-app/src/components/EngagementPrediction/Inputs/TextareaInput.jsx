import React from 'react';

const TextareaInput = ({ name, value, onChange, placeholder }) => {
  return (
    <label>
      {name.charAt(0).toUpperCase() + name.slice(1)}:
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="animated-input"
      />
    </label>
  );
};

export default TextareaInput;
