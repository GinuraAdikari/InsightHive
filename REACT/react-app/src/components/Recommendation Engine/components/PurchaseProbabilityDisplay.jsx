import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/newStyles.css"; // your existing styles

const PurchaseProbabilityDisplay = ({ probability }) => {
  if (!probability) return null;

  const numericValue = parseFloat(probability.replace("%", ""));

  // Determine color based on probability
  let color = "#ff3f02"; // default (red)
  if (numericValue > 70) {
    color = "#1ee92e"; // green
  } else if (numericValue >= 40) {
    color = "#daaf23"; // yellow
  }

  return (
    <div className="probability-container" >
      <h2 className="probability-heading">Purchase Probability</h2>
      <p className="probability-text">We’ve studied how <span className="highlighted-keyword">thousands</span> of people shop now we use that data to guess how likely this visitor is to buy, based on what they’re doing right now</p>
      <div className="gauge-wrapper">
        <CircularProgressbar
          value={numericValue}
          text={`${numericValue.toFixed(1)}%`}
          styles={buildStyles({
            pathColor: color,
            textColor: "#ffffff",
            trailColor: "#222",
            backgroundColor: "#000",
            textSize: "16px"
          })}
        />
      </div>
    </div>
  );
};

export default PurchaseProbabilityDisplay;
