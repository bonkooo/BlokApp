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
    ime="Pera" 
    prezime="Peric" 
    fakultet="ETF" 
    brojIndeksa="2023/0001" 
    radnaGrupa="MIA"
/>
    <Footer/>
    </>
  );
}

export default Profile;