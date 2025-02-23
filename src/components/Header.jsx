import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import logo from '../assets/logo.png'; // Correct import path
import './Header.css';

const Header = () => {
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
                            Insight Hive
                        </Typography>
                    </div>

                    {/* Navigation links */}
                    <div className="nav-links">
                        <Link to="/about" className="nav-link">
                            About Us
                        </Link>
                        <Link to="/login" className="nav-link">
                            Login
                        </Link>
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