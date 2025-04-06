import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import CustomerSegmentation from './components/CustomerSegmentation';
import EngagementPrediction from './components/EngagementPrediction';
import RecommendationEngines from './components/RecommendationEngines';
import SentimentAnalysis from './components/SentimentAnalysis';
import Login from './components/Login';
import SignUp from './components/SignUp';
import MyAccount from './components/MyAccount';
import './App.css';

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

function AppContent() {
    const location = useLocation();
    const hideHeaderPaths = [
        '/customer-segmentation',
        '/engagement-prediction',
        '/recommendation-engines',
        '/sentiment-analysis',
    ];

    // Check if the current path is in the hideHeaderPaths array
    const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

    return (
        <>
            {shouldShowHeader && <Header />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/customer-segmentation" element={<CustomerSegmentation />} />
                <Route path="/engagement-prediction" element={<EngagementPrediction />} />
                <Route path="/recommendation-engines" element={<RecommendationEngines />} />
                <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/my-account" element={<MyAccount />} />
            </Routes>
        </>
    );
}

export default App;