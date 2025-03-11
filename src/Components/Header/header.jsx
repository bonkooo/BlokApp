import React from 'react';
import './header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <img src="" alt="" />
            </div>
            <nav className="nav-links">
                <div className="nav-btn"><a href="#home">Home</a></div>
                <div className="nav-btn"><a href="#home">Home</a></div>
                <div className="nav-btn"><a href="#home">Home</a></div>
                <div className="nav-btn"><a href="#home">Home</a></div>
            </nav>
            <button className="cta-button">Get Started</button>
        </header>
    );
};

export default Header;