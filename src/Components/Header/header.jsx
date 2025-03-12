import React from 'react';
import './header.css';
import logo from '../../Assets/logo.png';
import applyIcon from '../../Assets/applyIcon.png';
import { Link } from 'react-router-dom';


const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <Link to="/">
                    <img src={logo} alt="" />
                </Link>
            </div>
            <div className="navBtns">
                <Link to="/ChatsMenu" className="nav-btn">Moji četovi</Link>
                <Link to="/Zaduzenja" className="nav-btn">Zaduženja</Link>
                <Link to="/redari" className="nav-btn">Forme</Link>
                <Link to="/test" className="nav-btn">Test ličnosti</Link>
                <Link to="/profile" className="nav-btn">Profil</Link>
                <Link to="/news" className="nav-btn">Vesti</Link>
                <Link to="/login" className='nav-btn login-btn'>Prijava ✔️</Link>
            </div>
            <div className="cta-button">
                
            </div>
        </header>
    );
};

export default Header;