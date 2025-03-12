import React from 'react';
import Header from '../Components/Header/header.jsx';
import Footer from '../Components/Footer/footer.jsx';
import RecruitmentForm from '../Components/recruitmentForm/recruitmentForm.jsx';

function Chat() {
  return (
    <>
    <Header/>
    <RecruitmentForm isAdmin={true}/>
    <Footer/>
    </>
  );
}

export default Chat;