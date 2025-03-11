import React from 'react';
import './header.css';
import logo from '../../Assets/logo.png';
import applyIcon from '../../Assets/applyIcon.png';


const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="" />
            </div>
            <div className="navBtns">
                <div className="nav-btn">Moji četovi</div>
                <div className="nav-btn">Zaduženja</div>
                <div className="nav-btn">Redarstva</div>
                <div className="nav-btn">Test ličnosti</div>
                <div className="nav-btn">Nagrade</div>
                <div className="nav-btn">Vesti</div>
            </div>
            <div className="cta-button">
                <img className='applyIcon' src={applyIcon} alt="" />
                <h1 className='ctaText'>Prijava</h1>
                </div>
        </header>
    );
};

export default Header;