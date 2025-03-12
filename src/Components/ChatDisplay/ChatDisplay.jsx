import React, { useState, useEffect, useRef } from "react";
import "./ChatDisplay.css";
import axios from "axios";

const ChatDisplay = ({ chatId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [userData, setUserData] = useState(null);

    const chatBoxRef = useRef(null); // Create a reference for the chat box

    // Function to fetch user data and messages
    const fetchUserDataAndMessages = async () => {
        if (!chatId) return;

        try {
            // Fetch user data only once
            if (!userData) {
                const userResponse = await axios.get(
                    `http://192.168.255.63:4000/user_info`,
                    {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setUserData(userResponse.data);
            }

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

            const formattedMessages = response.data.map(msg => ({
                sender: msg.sender || "unknown",
                idSender: msg.idSender,
                text: msg.messageText || "",
                username: msg.username || "Unknown"
            }));

            setMessages(formattedMessages);
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessages([]);
        }
    };

    // Fetch messages every 600ms
    useEffect(() => {
        if (!chatId) return;

        fetchUserDataAndMessages();

        const interval = setInterval(fetchUserDataAndMessages, 600);

        return () => clearInterval(interval);
    }, [chatId]);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (newMessage.trim() === "" || !chatId || !userData) return;

        const newMsg = { sender: "user", idSender: userData.idUser, text: newMessage, username: "You" };

        setMessages(prevMessages => [...prevMessages, newMsg]);

        try {
            await axios.post(
                `http://192.168.255.63:4000/send_message`,
                {
                    idChat: chatId,
                    messageText: newMessage
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

        setNewMessage("");
    };

    return (
        <div className="chat-container">
            <div className="chat-box" ref={chatBoxRef}>
                {messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const isUser = msg.idSender === userData?.idUser;
                        const senderName = isUser ? "" : msg.username;

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
