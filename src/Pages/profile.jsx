import React from 'react';
import Header from '../Components/Header/header.jsx';
import Footer from '../Components/Footer/footer.jsx';
import Awards from '../Components/Awards/awards.jsx';
import UserInfo from '../Components/UserInfo/userInfo.jsx';

function Profile() {
  return (
    <>
    <Header/>
    <Awards completedAssignments={11}/>
    <UserInfo 
    ime="David Manojlo" 
    prezime="Marković" 
    fakultet="ETF Beograd" 
    brojIndeksa="2023/0203" 
    radnaGrupa="Bezbednost"
/>
    <Footer/>
    </>
  );
}

export default Profile;