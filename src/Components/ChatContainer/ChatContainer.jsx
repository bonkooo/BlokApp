import React, { useState } from "react";
import ChatsMenu from "../ChatsMenu/ChatsMenu";
import ChatDisplay from "../ChatDisplay/ChatDisplay";
import "./ChatContainer.css";

const ChatContainer = () => {
    const [selectedChatId, setSelectedChatId] = useState(null);

    return (
        <div className="main-chat-container">
            <ChatsMenu onChatSelect={setSelectedChatId} />
            <ChatDisplay chatId={selectedChatId} />
        </div>
    );
};

export default ChatContainer;
