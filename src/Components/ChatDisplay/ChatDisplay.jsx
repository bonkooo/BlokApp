import React, { useState, useEffect } from "react";
import "./ChatDisplay.css";
import axios from "axios";

const ChatDisplay = ({ chatId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // Function to fetch messages from backend API
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://your-backend-url.com/api/chats/${chatId}/messages`);
            setMessages(response.data.messages); // Assuming response contains { messages: [...] }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Fetch messages when component mounts or when chatId changes
    useEffect(() => {
        if (chatId) {
            fetchMessages();
        }
    }, [chatId]);

    const sendMessage = async () => {
        if (newMessage.trim() === "") return;
    
        const newMsg = { sender: "user", text: newMessage };
    
        // Update the local UI immediately
        setMessages([...messages, newMsg]);
    
        // Retrieve token from sessionStorage
        const token = sessionStorage.getItem("token");
    
        // Send the new message to the backend with Authorization header
        try {
            await axios.post(
                `http://192.168.255.63:4000/send_message`,
                {
                    // chatId,
                    message: newMessage,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (error) {
            console.error("Error sending message:", error);
        }
    
        setNewMessage(""); // Clear input field
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
