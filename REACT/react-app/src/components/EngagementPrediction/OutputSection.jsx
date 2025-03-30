import React from "react";
import "./styles/EngagementForm.css";

const OutputSection = ({ responseMessage, onSave }) => {
  return (
    <div className="output-container">
      <h2 className="output-title">Engagement Prediction Result</h2>
      {responseMessage ? (
        <>
          <p className="output-content">
            Your Engagement Prediction score is {responseMessage}
          </p>
          <button className="save-button" onClick={onSave}>
            Save
          </button>
        </>
      ) : (
        <p className="placeholder-text">
          Output will be displayed here upon submission.
        </p>
      )}
    </div>
  );
};

export default OutputSection;
