import React, { useState } from "react";
import "./NewsManager.css";

const NewsManager = ({ isAdmin }) => {
    const [news, setNews] = useState([
        {
            id: 1,
            title: "Nova funkcionalnost dodata!",
            username: "Admin",
            date: "2025-03-11",
            content: "Dodali smo novu funkcionalnost koja omogućava korisnicima da lakše upravljaju svojim podacima."
        },
        {
            id: 2,
            title: "Održavanje sistema",
            username: "Moderator",
            date: "2025-03-10",
            content: "Sistem će biti u održavanju 12. marta od 00:00 do 04:00. Molimo vas za strpljenje."
        }
    ]);

    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;

        const newPost = {
            id: news.length + 1,
            title: newTitle,
            username: "Admin", // You can modify this to use actual username
            date: new Date().toISOString().split("T")[0],
            content: newContent
        };

        setNews([newPost, ...news]); // Adds new post at the top
        setNewTitle("");
        setNewContent("");
    };

    return (
        <div className="news-container">
            {isAdmin && (
                <div className="news-form">
                    <h2>Dodaj Vest</h2>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder="Naslov" 
                            value={newTitle} 
                            onChange={(e) => setNewTitle(e.target.value)}
                            required
                        />
                        <textarea 
                            placeholder="Tekst vesti..." 
                            value={newContent} 
                            onChange={(e) => setNewContent(e.target.value)}
                            required
                        />
                        <button type="submit">Objavi</button>
                    </form>
                </div>
            )}

            <div className="news-list">
                {news.map((item) => (
                    <div key={item.id} className="news-item">
                        <h3 className="news-title">{item.title}</h3>
                        <p className="news-meta">Objavio: <strong>{item.username}</strong> | {item.date}</p>
                        <p className="news-content">{item.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsManager;
