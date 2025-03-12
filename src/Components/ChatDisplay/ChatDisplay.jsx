import React, { useState, useEffect } from "react";
import "./ChatDisplay.css";
import axios from "axios";

const ChatDisplay = ({ chatId }) => {
    const [messages, setMessages] = useState([]); // Always initialize as an array
    const [newMessage, setNewMessage] = useState("");
    const [userData, setUserData] = useState(null); // Store user data

    // Fetch user data and messages when a new chat is selected
    useEffect(() => {
        if (!chatId) return;

        const fetchUserDataAndMessages = async () => {
            try {
                // Fetch user data
                const userResponse = await axios.get(
                    `http://192.168.255.63:4000/user_info`,
                    {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setUserData(userResponse.data); // Store user data

                // Fetch chat messages
                const response = await axios.post(
                    `http://192.168.255.63:4000/chat_messages`,
                    { idChat: chatId },
                    {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                // Extract messages and store usernames
                const formattedMessages = response.data.map(msg => ({
                    sender: msg.sender || "unknown",
                    idSender: msg.idSender,
                    text: msg.messageText || "",
                    username: msg.username || "Unknown" // Store username directly from API
                }));

                setMessages(formattedMessages);
            } catch (error) {
                console.error("Error fetching data:", error);
                setMessages([]); // Set empty messages if API call fails
            }
        };

        fetchUserDataAndMessages();
    }, [chatId]);

    const sendMessage = async () => {
        if (newMessage.trim() === "" || !chatId || !userData) return;

        const newMsg = { sender: "user", idSender: userData.idUser, text: newMessage, username: "You" };

        // Update UI immediately
        setMessages(prevMessages => [...prevMessages, newMsg]);

        // Send message to backend
        try {
            await axios.post(
                `http://192.168.255.63:4000/send_message`,
                {
                    idChat: chatId,
                    messageText: newMessage  // Ensure messageText is used in request
                },
                {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
                        'Content-Type': 'application/json'
                    }
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
                {messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const isUser = msg.idSender === userData?.idUser;
                        const senderName = isUser ? "You" : msg.username;

                        return (
                            <div key={index} className="message-container">
                                <div className="message-sender">{senderName}</div>
                                <div className={`message ${isUser ? "user" : "other"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-messages">Nema poruka u ovom četu.</div>
                )}
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