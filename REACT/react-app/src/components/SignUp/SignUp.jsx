import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { supabase } from "../../supabaseClient";

import './SignUp.css';


const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        navigate('/'); // Navigate to the home screen
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) newErrors.name = 'Name is required';
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

     const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Sign up the user with Supabase Authentication
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            // Store additional user info in the "users" table
            const { error: dbError } = await supabase.from("users").insert([
                { id: data.user.id, name: formData.name, email: formData.email },
            ]);

            if (dbError) throw dbError;

            alert("Registration successful! Please check your email for verification.");
            navigate("/login"); // Redirect to login
        } catch (error) {
            setErrors({ form: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <button className="close-button-SignUp" onClick={handleClose}>×</button>
                
                <h1>Sign Up</h1>
                
                <form className="signup-form" onSubmit={handleSubmit}>
                    {errors.form && <p className="error">{errors.form}</p>}
                    
                    <div className="input-container">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {errors.name && <span className="error">{errors.name}</span>}
                    </div>
                    
                    <div className="input-container">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    
                    <div className="input-container">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    
                    <div className="input-container">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                    </div>

                    <button type="submit" disabled={loading}>{loading ? "Signing Up..." : "Sign Up"}</button>
                
                </form>
                
                <p className="login-link">
                    Already have an account? <Link to="/login">Login Here</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;