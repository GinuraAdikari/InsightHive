import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
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

import AOS from 'aos';
import 'aos/dist/aos.css';

import {FaUsers} from "react-icons/fa";
import {MdTimeline} from "react-icons/md";
import {IoMdOptions} from "react-icons/io";
import {BiHappy} from "react-icons/bi";

const Home = () => {
    const [user, setUser] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        checkUser();
        
        AOS.init({ 
            duration: 1000,
            once: true,
            offset: 100
        });
        setTimeout(() => {
            AOS.refresh();
        }, 500)

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
                <h1>Welcome to <span>InsightHive</span></h1>
                <p>Unlock the power of data with our advanced analytics tools.</p>
            </div>

            <div className="intro-banner" data-aos="fade-up">
                <div className="intro-image" data-aos="fade-right">
                    <img src="../home.jpg" alt="Insight Hive team" />
                </div>
                <div className="intro-text">
                    <h2>We are <span className="glow-text">InsightHive</span></h2>
                    <p>
                        At InsightHive, we don't just analyze data—we transform it into powerful decisions.
                        From startups to enterprises, our intelligent tools deliver real-time segmentation,
                        predictions, and personalized insights to elevate your business strategies.
                    </p>
                    <p>
                        Let our AI-driven platform help you understand your audience and act faster with precision.
                    </p>
                </div>
            </div>

            <div className="grid-container">
                <div className="box" onClick={() => handleNavigation("/customer-segmentation")}>
                    <FaUsers className="box-icon"/>
                    <h2>Customer Segmentation</h2>
                    <p className="box-desc">Group customers based on similar behaviors and traits.</p>
                </div>
                <div className="box" onClick={() => handleNavigation("/engagement-prediction")}>
                    <MdTimeline className="box-icon"/>
                    <h2>Engagement Prediction</h2>
                    <p className="box-desc">Predict user interaction and engagement trends.</p>
                </div>
                <div className="box" onClick={() => handleNavigation("/recommendation-engines")}>
                    <IoMdOptions className="box-icon"/>
                    <h2>Recommendation Engine</h2>
                    <p className="box-desc">Offer smart suggestions based on user behavior.</p>
                </div>
                <div className="box" onClick={() => handleNavigation("/sentiment-analysis")}>
                    <BiHappy className="box-icon"/>
                    <h2>Sentiment Analysis</h2>
                    <p className="box-desc">Analyze customer opinions and extract sentiment.</p>
                </div>
            </div>

            <div className="banner-grid">
                <div className="banner-card">
                    <div className="card-icon">📊</div>
                    <h3>Behavioral Patterns</h3>
                    <p>Discover how users interact with your platform and identify usage trends.</p>
                </div>
                <div className="banner-card">
                    <div className="card-icon">🧭</div>
                    <h3>Customer Journey Mapping</h3>
                    <p>Track the full customer lifecycle—from acquisition to retention.</p>
                </div>
                <div className="banner-card">
                    <div className="card-icon">⚠️</div>
                    <h3>Churn Prediction</h3>
                    <p>Detect signals of customer drop-off and act early to prevent it.</p>
                </div>
                <div className="banner-card">
                    <div className="card-icon">⏱️</div>
                    <h3>Real-Time Feedback</h3>
                    <p>Access real-time sentiment analysis to understand user satisfaction instantly.</p>
                </div>
                <div className="banner-card">
                    <div className="card-icon">💰</div>
                    <h3>Sales Optimization</h3>
                    <p>Identify top-performing segments and tailor offers to boost conversions.</p>
                </div>
                <div className="banner-card">
                    <div className="card-icon">📑</div>
                    <h3>Custom Reports</h3>
                    <p>Generate tailored insights for teams, clients, or internal strategy.</p>
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
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUp />} />
                <Route path="/my-account" element={user ? <MyAccount /> : <Navigate to="/login" />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
