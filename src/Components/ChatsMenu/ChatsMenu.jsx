import React, { useState, useEffect } from 'react';
import './ChatsMenu.css';
import defaultIcon from '../../Assets/default-group.png';
import rgbIcon from '../../Assets/rgb.png';
import miaIcon from '../../Assets/motivation.png';
import logIcon from '../../Assets/logistics.png';
import comIcon from '../../Assets/communication.png';

// Mapping chat names to corresponding icons
const iconMap = {
    'SigurnostChat': rgbIcon,
    'MiA Chat': miaIcon,
    'Logistika Chat': logIcon,
    'Komunikacije Chat': comIcon,
    'Diskusija Chat': defaultIcon
};

const ChatsMenu = ({ onChatSelect }) => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://192.168.255.63:4000/chats', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + window.sessionStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setGroups(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading chats: {error.message}</div>;

    return (
        <div className="chats-menu">
            <h2>Tvoji četovi</h2>
            <hr />
            {groups.map(group => (
                <div 
                    key={group.idChat} 
                    className="chat-card" 
                    onClick={() => onChatSelect(group.idChat)} // Fetch messages when clicked
                >
                    <img 
                        src={iconMap[group.chatName] || defaultIcon} 
                        alt={group.chatName} 
                        className="chat-card-image" 
                    />
                    <span className="chat-card-name">{group.chatName}</span>
                </div>
            ))}
        </div>
    );
};

export default ChatsMenu;