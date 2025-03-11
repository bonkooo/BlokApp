import React, { useState } from 'react';
import './SignUp.css';
import user_icon from '../../Assets/person.png';
import email_icon from '../../Assets/email.png';
import password_icon from '../../Assets/password.png';
import logo from '../../Assets/logo.png';
import axios from 'axios';

export const Signup = () => {
    const [action, setAction] = useState("Sign up");
    const [email, setEmail] = useState("");  // Initialized as empty string
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(event) {
        if (action === "Sign up") {
            event.preventDefault();
       
            if (!email || !password || !name) {
                console.log("Email, password and name are required!");
                return;
            }

            console.log("Sending request to backend...");
            console.log("Sending: " + email + " " + password + " " + name);

            axios.post('http://192.168.255.63:4000/register', { username: name, email: email, password: password })
            .then(res => window.sessionStorage.setItem('token', res.data.accessToken))
            .catch(err => console.error("Error:", err));

        } else if (action === "Log in") {
            event.preventDefault();
       
            if (!email || !password) {
                console.log("Email and password are required!");
                return;
            }

            console.log("Sending request to backend...");
            console.log("Sending: " + email + " " + password + " " + name);

            axios.post('http://192.168.255.63:4000/login', { username: email, password: password })
            .then(res => window.sessionStorage.setItem('token', res.data.accessToken))
            .catch(err => {
                console.error("Error:", err)
                alert("Invalid user or password.")
            });
        }
       

       
    }

    const handleLoginClick = (e) => {
        if (action !== "Log in") {
            e.preventDefault();
            setAction("Log in"); // Switch to login mode
        } 
    };

    return (
    <div className="container">
        <div className="header-signup">
            <img src={logo}  alt="Logo" className="logo" />
            <div className="text">{action === "Sign up" ? "Registruj se" : "Prijavi se"}</div>
            <div className="underline"></div>
        </div>

        {/* Add form submit event */}
        <form onSubmit={handleSubmit} className="inputs">
            {action === "Log in" ? null : (
                <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Pera Peric" />
                </div>
            )}
            <div className="input">
                <img src={email_icon} alt="" />
                <input 
                    type="text" 
                    placeholder="peraperic@mail.dom" 
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
                    onClick={handleLoginClick}
                >
                    Registruj se
                </button>

                {/* Use type="submit" to allow form submission */}
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