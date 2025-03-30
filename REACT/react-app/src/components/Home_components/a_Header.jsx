import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Button} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { supabase } from '../../supabaseClient';
import logo from '../../assets/logo.png'; // Correct import path
import './a_Header.css';

const Header = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error);
            } else {
                setUser(data.user);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate('/'); // Redirect to Home
    };

    return (
        <div>
            {/* Black bar at the top */}
            <div className="black-bar"></div>

            {/* Header with logo and navigation */}
            <AppBar position="fixed" className="header">
                <Toolbar>
                    {/* Logo and Insight Hive name */}
                    <div className="logo-container">
                        <img src={logo} alt="Insight Hive Logo" className="logo" />
                        <Typography variant="h4" className="site-name">
                            InsightHive
                        </Typography>
                    </div>

                    {/* Navigation links */}
                    <div className="nav-links">
                        <Link to="/" className="nav-link">
                            <p>Home</p>
                        </Link>
                        <Link to="/about" className="nav-link">
                            <p>About Us</p>
                        </Link>

                        {user ? (
                            // If user is logged in, show Logout button
                            <Button onClick={handleLogout} className="nav-link-button">SignOut</Button>
                        ) : (
                            // If user is not logged in, show Login button
                            <Link to="/login" className="nav-link-button">SignIn</Link>
                        )}

                        <IconButton color="inherit" className="account-icon">
                            <AccountCircle />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Header;