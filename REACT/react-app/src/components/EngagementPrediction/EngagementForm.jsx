import React from 'react';
import SelectInput from './Inputs/SelectInput';
import TextareaInput from './Inputs/TextareaInput';
import CheckboxInput from './Inputs/CheckboxInput';
import "./styles/EngagementForm.css";

const EngagementForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <form className="engagement-form" onSubmit={handleSubmit}>
      <SelectInput 
        name="platform" 
        label="Platform" 
        value={formData.platform} 
        onChange={handleChange} 
        options={["DV360", "Facebook Ads", "Google Ads"]} 
      />
      <SelectInput 
        name="channel" 
        label="Channel Type" 
        value={formData.channel} 
        onChange={handleChange} 
        options={["Mobile", "Search", "Social", "Video", "Display"]} 
      />
      <SelectInput
        name="region"
        label="Region"
        value={formData.region}
        onChange={handleChange}
        options={["Africa/Cairo", "America/New_York", "Asia/Calcutta",
           "Asia/Kolkata", "Asia/Muscat",
          "Asia/Singapore", "US/Eastern"]}
      />
      <TextareaInput 
        name="advertiser" 
        value={formData.advertiser} 
        onChange={handleChange} 
        placeholder="Enter advertiser" 
      />
      <TextareaInput 
        name="keywords" 
        value={formData.keywords} 
        onChange={handleChange} 
        placeholder="Enter keywords separated by commas" 
      />
      <TextareaInput 
        name="search_tags" 
        value={formData.search_tags} 
        onChange={handleChange} 
        placeholder="Enter search tags separated by commas" 
        />
      <label>
        Campaign Duration:
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Enter campaign duration"
          className="animated-input"
        />
      </label>
      <label>
        What is your budget?
        <input
          type='range'
          name='budget'
          min='0'
          max='9999'
          value={formData.budget}
          onChange={handleChange}
          className='budget-slider'
        />
        <span className="budget-value">${Number(formData.budget).toLocaleString()}</span>
      </label>
      <CheckboxInput 
        name="isAvailable" 
        checked={formData.isAvailable} 
        onChange={handleChange} 
      />
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default EngagementForm;
