import React from 'react';
import './Global.css';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Pages/home.jsx';
import Login from './Pages/login.jsx';
import Chat from './Pages/chat.jsx'
import Assignments from './Pages/assignments.jsx'
import Redari from './Pages/redari.jsx'
import Test from './Pages/test.jsx'
import Rewards from './Pages/rewards.jsx'
import News from './Pages/news.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ChatsMenu" element={<Chat />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path = "/redari" element={<Redari />} />
        <Route path = "/test" element={<Test />} />
        <Route path = "/rewards" element={<Rewards />} />
        <Route path = "/news" element={<News />} />
      </Routes>
    </Router>
  );
}

export default App;