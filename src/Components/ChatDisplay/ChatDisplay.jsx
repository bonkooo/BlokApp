import React, { useState } from "react";
import "./ChatDisplay.css";

const ChatDisplay = () => {
    const [messages, setMessages] = useState([
        { sender: "other", text: "Zdravo! Kako si?" },
        { sender: "user", text: "Ćao! Dobro sam, ti?" },
        { sender: "other", text: "Kurcina" },
    ]);
    const [newMessage, setNewMessage] = useState("");

    const sendMessage = () => {
        if (newMessage.trim() === "") return;

        const newMsg = { sender: "user", text: newMessage };
        setMessages([...messages, newMsg]);
        setNewMessage(""); 
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Napiši poruku..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Pošalji</button>
            </div>
        </div>
    );
};

export default ChatDisplay;
