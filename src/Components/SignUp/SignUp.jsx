import React, { useState } from 'react';
import './SignUp.css';
import user_icon from '../../Assets/person.png';
import email_icon from '../../Assets/email.png';
import password_icon from '../../Assets/password.png';
import logo from '../../Assets/logo.png';
import axios from 'axios';

export const Signup = () => {
    const [action, setAction] = useState("Sign up");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (action === "Sign up") {
            if (!email || !password || !name) {
                alert("Email, password, and name are required!");
                return;
            }

            try {
                const res = await axios.post('http://192.168.255.63:4000/register', {
                    username: email,
                    email: name,
                    password: password
                });

                window.sessionStorage.setItem('token', res.data.accessToken);
                // window.location.href = '/'; // Redirect to home page after successful registration
                setAction("Log in");
                alert("Registration successful. Please log in.");
            } catch (err) {
                console.error("Error:", err);
                alert("Registration failed. Please try again.");
            }
        } 
        
        else if (action === "Log in") {
            if (!email || !password) {
                alert("Email and password are required!");
                return;
            }

            try {
                const res = await axios.post('http://192.168.255.63:4000/login', {
                    username: email, // Assuming backend uses email as username
                    password: password
                });

                window.sessionStorage.setItem('token', res.data.accessToken);
                window.location.href = '/'; // Redirect to home page after successful login
            } catch (err) {
                console.error("Error:", err);
                alert("Invalid username or password.");
            }
        }
    };

    const handleLoginClick = (e) => {
        if (action !== "Log in") {
            e.preventDefault();
            setAction("Log in");
            // setEmail("");
            // setPassword("");
            // setName("");
        }
    };
    const handleLoginClickSignup = (e) => {
        if (action !== "Sign up") {
            e.preventDefault();
            setAction("Sign up");
            
        }
    };

    return (
        <div className="container">
            <div className="header-signup">
                <img src={logo} alt="Logo" className="logo" />
                <div className="text">{action === "Sign up" ? "Registruj se" : "Prijavi se"}</div>
                <div className="underline"></div>
            </div>

            <form onSubmit={handleSubmit} className="inputs">
                {action === "Sign up" && (
                    <div className="input">
                        <img src={email_icon} alt="" />
                        <input 
                            type="text" 
                            placeholder="Email" 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                )}
                <div className="input">
                    <img src={user_icon} alt="" />
                    <input 
                        type="text" 
                        placeholder="Korisničko ime" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input 
                        type="password" 
                        placeholder="********" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <div className="forgot-password">Zaboravljena šifra? <span id='clickHereBtn'>Kliknite ovde!</span></div>

                <div className="submit-container">
                    <button 
                        className={action === "Sign up" ? "submit" : "submit gray"} 
                        type="submit"
                        onClick={handleLoginClickSignup}
                    >
                        Registruj se
                    </button>

                    <button 
                        className={action === "Log in" ? "submit" : "submit gray"} 
                        type="submit"
                        onClick={handleLoginClick}
                    >
                        Prijavi se
                    </button>
                </div>
            </form>
        </div>
    );
};
