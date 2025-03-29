import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Header from './components/Home_components/a_Header';

import CustomerSegmentation from './components/Customer Segmentation/CustomerSegmentation';
import EngagementPrediction from './components/EngagementPrediction/EngagementPrediction';
import RecommendationEngines from './components/Recommendation Engine/RecommendationEngines';
import SentimentAnalysis from './components/Sentiment Analysis/SentimentAnalysis';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import { supabase } from './supabaseClient';
import './App.css';
import PopupMessage from "./components/PopupMessage"; // Import the popup


import Footer from './components/Home_components/a_Footer';
import AboutUs from './components/AboutUs'
import MyAccount from './components/MyAccount';



const Home = () => {
    const [user, setUser] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        checkUser();
    }, []);

    const handleNavigation = (path) => {
        if (!user) {
            setPopupMessage("You must be logged in to access this feature.");
        } else {
            window.location.href = path;
        }
    };

    return (
        <div className="home-container">
            {popupMessage && <PopupMessage message={popupMessage} onClose={() => setPopupMessage("")} />}

            <div className="welcome-message">
                <h1>Welcome to <span>Insight Hive</span></h1>
                <p>Unlock the power of data with our advanced analytics tools.</p>
            </div>
            <div className="grid-container">
                <div className="box" onClick={() => handleNavigation("/customer-segmentation")}>
                    <h2>Customer Segmentation</h2>
                </div>
                <div className="box" onClick={() => handleNavigation("/engagement-prediction")}>
                    <h2>Engagement Prediction</h2>
                </div>
                <div className="box" onClick={() => handleNavigation("/recommendation-engines")}>
                    <h2>Recommendation Engine</h2>
                </div>
                <div className="box" onClick={() => handleNavigation("/sentiment-analysis")}>
                    <h2>Sentiment Analysis</h2>
                </div>
            </div>
        </div>
    );
};


function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/customer-segmentation" element={<CustomerSegmentation />} />
                <Route path="/engagement-prediction" element={<EngagementPrediction />} />
                <Route path="/recommendation-engines" element={<RecommendationEngines />} />
                <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
                <Route path="/login" element={user ? <Navigate to="/my-account" /> : <Login />} />
                <Route path="/signup" element={user ? <Navigate to="/my-account" /> : <SignUp />} />
                <Route path="/my-account" element={user ? <MyAccount /> : <Navigate to="/login" />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
