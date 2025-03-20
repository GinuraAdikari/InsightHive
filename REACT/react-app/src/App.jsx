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

import Footer from './components/Home_components/a_Footer';
import Home from './components/Home_components/Home';
import AboutUs from './components/AboutUs'
import MyAccount from './components/MyAccount';;


function App() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is already logged in
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        checkUser();

        // Listen for auth state changes
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