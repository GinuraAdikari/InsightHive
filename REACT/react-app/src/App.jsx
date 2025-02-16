import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AboutUs from "./AboutUs";
import Login from "./Login";
import "./App.css";

function Home() {
  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">InsightHive</h1>
        <div className="nav-links">
          <Link to="/about">About Us</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      {/* Main Section */}
      <section className="main-content">
        <h2 className="section-title">Our Capabilities</h2>
        <div className="components-grid">
          <div className="component-box customer">
            <i className="fas fa-users icon"></i>
            <p>Customer Segmentation</p>
          </div>
          <div className="component-box sentiment">
            <i className="fas fa-chart-line icon"></i>
            <p>Sentiment Analysis</p>
          </div>
          <div className="component-box engagement">
            <i className="fas fa-comments icon"></i>
            <p>Engagement Prediction</p>
          </div>
          <div className="component-box recommendation">
            <i className="fas fa-star icon"></i>
            <p>Recommendation System</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;