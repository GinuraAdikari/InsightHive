import React from 'react'; 
import './AboutUs.css'; 
import { FaUsers, FaComments, FaChartLine, FaStar } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="about-container">
      {/* Header */}
      <header className="about-header">
        <h1>About <span className="highlight">InsightHive</span></h1>
        <p>Transforming Data into Actionable Business Insights</p>
      </header>

      {/* Introduction */}
      <section className="about-intro">
        <p>
          InsightHive is an AI-powered analytics platform designed to help businesses gain deep insights from customer feedback, 
          engagement patterns, and market trends. Our cutting-edge technology leverages machine learning to enhance decision-making and customer experiences.
        </p>
      </section>

      {/* Mission Statement */}
      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to empower businesses with intelligent insights, enabling them to make data-driven decisions that 
          enhance customer satisfaction, engagement, and overall market presence.
        </p>
      </section>

      {/* Core Features */}
      <section className="about-features">
        <h2>What We Offer</h2>
        <div className="features-grid">
          <div className="feature-box">
            <FaUsers className="feature-icon" />
            <h3>Customer Segmentation</h3>
            <p>Identify and group customers based on behavior, preferences, and demographics.</p>
          </div>
          <div className="feature-box">
            <FaChartLine className="feature-icon" />
            <h3>Sentiment Analysis</h3>
            <p>Analyze customer feedback to determine emotions and sentiment trends.</p>
          </div>
          <div className="feature-box">
            <FaComments className="feature-icon" />
            <h3>Engagement Prediction</h3>
            <p>Predict user interactions and optimize engagement strategies.</p>
          </div>
          <div className="feature-box">
            <FaStar className="feature-icon" />
            <h3>Recommendation System</h3>
            <p>Deliver personalized product and service recommendations.</p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <img src="../member2.jpg" alt="Member 2" />
            <h4>Ginura</h4>
            <p>Frontend & UI/UX Developer</p>
          </div>
          <div className="team-card">
            <img src="../member3.jpg" alt="Member 3" />
            <h4>Appu</h4>
            <p>Frontend & UI/UX Developer</p>
          </div>
          <div className="team-card">
            <img src="../member4.jpg" alt="Member 4" />
            <h4>Anuradha</h4>
            <p>Frontend & UI/UX Developer</p>
          </div>
          <div className="team-card">
            <img src="../member1.jpg" alt="Amanda" />
            <h4>Dhanuji</h4>
            <p>Frontend & UI/UX Developer</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <p>©️ {new Date().getFullYear()} InsightHive. All rights reserved.</p>
      </footer>
    </div>

    
  );
};

export default AboutUs;