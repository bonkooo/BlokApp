import React from 'react';
import Header from '../Components/Header/header.jsx';
import Footer from '../Components/Footer/footer.jsx';
import ChatContainer from '../Components/ChatContainer/ChatContainer.jsx';
import ChatsMenu from '../Components/ChatsMenu/ChatsMenu.jsx';

function Chat() {
  return (
    <>
    <Header/>
    <ChatContainer/>
    <Footer/>
    </>
  );
}

export default Chat;