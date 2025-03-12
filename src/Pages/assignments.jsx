import React from 'react';
import Header from '../Components/Header/header.jsx';
import Footer from '../Components/Footer/footer.jsx';
import AssignmentManager from '../Components/AssignmentManager/AssignmentManager.jsx';

function Chat() {
  return (
    <>
    <Header/>
    <AssignmentManager isAdmin={true}/>
    <Footer/>
    </>
  );
}

export default Chat;