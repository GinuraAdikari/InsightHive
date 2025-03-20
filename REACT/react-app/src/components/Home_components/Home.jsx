import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="welcome-message">
                <h1>Welcome to Insight Hive</h1>
                <p>Unlock the power of data with our advanced analytics tools.</p>
            </div>
            <div className="grid-container">
                <Link to="/customer-segmentation" className="box box1">
                    <h2>Customer Segmentation</h2>
                </Link>
                <Link to="/engagement-prediction" className="box box2">
                    <h2>Engagement Prediction</h2>
                </Link>
                <Link to="/recommendation-engines" className="box box3">
                    <h2>Recommendation Engine</h2>
                </Link>
                <Link to="/sentiment-analysis" className="box box4">
                    <h2>Sentiment Analysis</h2>
                </Link>
            </div>
        </div>
    );
};

export default Home;