import React from 'react';
import ChatsMenu from '../ChatsMenu/ChatsMenu';
import ChatDisplay from '../ChatDisplay/ChatDisplay';
import './ChatContainer.css';

const ChatContainer = () => {
    return (
        <div className="main-chat-container">
            <ChatsMenu />
            <ChatDisplay />
        </div>
    );
};

export default ChatContainer;
