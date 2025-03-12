import React from 'react';
import Header from '../Components/Header/header.jsx';
import Footer from '../Components/Footer/footer.jsx';
import NewsManager from '../Components/NewsManager/NewsManager.jsx';

function Chat() {
  const isAdmin = true; // Set admin status

  return (
    <>
      <Header />
      <NewsManager isAdmin={isAdmin} /> 
      <Footer />
    </>
  );
}

export default Chat;
