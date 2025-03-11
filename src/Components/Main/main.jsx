import React, { useState, useEffect } from 'react';
import './main.css';

const Main = () => {
    const [timeElapsed, setTimeElapsed] = useState(calculateTimeElapsed());

    function calculateTimeElapsed() {
        const startDate = new Date('2024-11-26T11:52:00');
        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

        return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeElapsed(calculateTimeElapsed());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="main-container">
            <div className="timer-box">
                <h1>{timeElapsed}</h1>
                <p className="status-text">Zahtevi nisu ispunjeni.</p>
            </div>
            <div className="app-description">
                <h2>BlockApp</h2>
                <p>
                    Lakša komunikacija i organizacija studenata u blokadi, efikasno i bezbedno deljenje informacija i koordinacija 
                    aktivnosti.
                </p>
            </div>
        </main>
    );
};

export default Main;
