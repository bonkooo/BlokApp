import React from 'react';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Pages/home.jsx';
import Login from './Pages/login.jsx';
import Chat from './Pages/chat.jsx'
import Assignments from './Pages/assignments.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/assignments" element={<Assignments />} />
        
      </Routes>
    </Router>
  );
}

export default App;