import React from "react";
import "./PopupMessage.css"; // Create a CSS file for styling

const PopupMessage = ({ message, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <p>{message}</p>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default PopupMessage;
