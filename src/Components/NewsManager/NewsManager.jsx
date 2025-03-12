import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NewsManager.css";

const GET_NEWS_URL = "http://192.168.255.63:4000/get_news";
const POST_NEWS_URL = "http://192.168.255.63:4000/post_news";
const USER_INFO_URL = "http://192.168.255.63:4000/user_info";

const NewsManager = ({ isAdmin }) => {
    const [news, setNews] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [postError, setPostError] = useState(null);
    const [userData, setUserData] = useState(null);

    // Fetch user data
    const getUserData = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(USER_INFO_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setUserData(response.data);
        } catch (err) {
            console.error("Failed to fetch user data", err);
            setError("Failed to load user info.");
        }
    };

    useEffect(() => {
        const fetchNews = async () => {
            try {
                await getUserData(); // Ensure user data is available first
                const token = sessionStorage.getItem("token");
                const response = await axios.get(GET_NEWS_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const formattedNews = response.data.map(item => ({
                    id: item.idVest,
                    title: item.naslov,
                    username: item.username,
                    date: item.datum,
                    content: item.tekst
                }));

                setNews(formattedNews);
            } catch (err) {
                setError("Failed to fetch news.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;

        if (!userData) {
            setPostError("User data is missing. Cannot post news.");
            return;
        }

        const token = sessionStorage.getItem("token");
        const newPost = {
            naslov: newTitle,
            username: userData.username, // Use the fetched username
            datum: new Date().toISOString().split("T")[0],
            tekst: newContent
        };

        try {
            const response = await axios.post(
                POST_NEWS_URL,
                newPost,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            // Only update UI if API request was successful
            if (response.status === 201 || response.status === 200) {
                const createdPost = {
                    id: response.data.idVest,
                    title: response.data.naslov,
                    username: response.data.username,
                    date: response.data.datum,
                    content: response.data.tekst
                };

                setNews([createdPost, ...news]); // Add new post to list only after API response
                setNewTitle("");  // Clear input fields
                setNewContent("");
                setPostError(null);

                window.location.reload();
            }
        } catch (err) {
            setPostError("Failed to post news.");
        }
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
                    {postError && <p className="error">{postError}</p>}
                </div>
            )}

            <div className="news-list">
                {loading ? (
                    <p>Loading news...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    news.map((item) => (
                        <div key={item.id} className="news-item">
                            <h3 className="news-title">{item.title}</h3>
                            <p className="news-meta">
                                Objavio: <strong>{item.username}</strong> | {item.date}
                            </p>
                            <p className="news-content">{item.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NewsManager;
