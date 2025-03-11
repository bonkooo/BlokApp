import React, { useState, useEffect } from 'react';
import './ChatsMenu.css';
import defaultIcon from '../../Assets/default-group.png'
import rgbIcon from '../../Assets/rgb.png'
import miaIcon from '../../Assets/motivation.png'
import logIcon from '../../Assets/logistics.png'
import comIcon from '../../Assets/communication.png'

const ChatsMenu = () => {

    const [groups, setGroups] = useState({
        Javna: true,
        Bezbednost: true,
        MIA: true,
        Logistika: true,
        Komunikacije: true
    });

    return (
        <div className="chats-menu">
            <h2>Tvoji četovi</h2>
            <hr />
            {groups.Javna && (
                <div className="chat-card">
                    <img src={defaultIcon} alt="Default Group" className="chat-card-image" />
                    <span className="chat-card-name">Javni čet</span>
                </div>
            )}
            {groups.Bezbednost && (
                <div className="chat-card">
                    <img src={rgbIcon} alt="Group 1" className="chat-card-image" />
                    <span className="chat-card-name">Bezbednost</span>
                </div>
            )}
            {groups.MIA && (
                <div className="chat-card">
                    <img src={miaIcon} alt="Group 2" className="chat-card-image" />
                    <span className="chat-card-name">Motivacija i Agitacija</span>
                </div>
            )}
            {groups.Logistika && (
                <div className="chat-card">
                    <img src={logIcon} alt="Group 3" className="chat-card-image" />
                    <span className="chat-card-name">Logistika</span>
                </div>
            )}
            {groups.Komunikacije && (
                <div className="chat-card">
                    <img src={comIcon} alt="Group 4" className="chat-card-image" />
                    <span className="chat-card-name">Komunikacije</span>
                </div>
            )}
        </div>
    );
};

export default ChatsMenu;
