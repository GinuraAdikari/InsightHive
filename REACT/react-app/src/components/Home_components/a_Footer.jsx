import React from "react";
import { Link } from "react-router-dom";
import "./a_Footer.css"; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Insight Hive. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/AboutUs">About Us</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;