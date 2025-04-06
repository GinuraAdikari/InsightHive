import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Login.css';

const Login = () => {
    const navigate = useNavigate(); // Hook for navigation

    const handleClose = () => {
        navigate('/'); // Navigate to the home screen
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <button className="close-button-Login" onClick={handleClose}>×</button> {/* Close button */}
                <h1>Login</h1>
                <form className="login-form">
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>
                <p className="register-link">
                    Don't have an account? <Link to="/signup">SignUp Here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;