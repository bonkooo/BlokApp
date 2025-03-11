import React from 'react';
import Header from '../Components/Header/header.jsx';
import Footer from '../Components/Footer/footer.jsx';
import Awards from '../Components/Awards/awards.jsx';

function Chat() {
  return (
    <>
    <Header/>
    <Awards completedAssignments={11}/>
    <Footer/>
    </>
  );
}

export default Chat;