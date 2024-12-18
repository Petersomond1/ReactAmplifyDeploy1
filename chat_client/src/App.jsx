import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Chatpage from './Components/Chatpage';
import FormPage from './Components/FormPage';
import ClarionCall from './Components/ClarionCall';
import AdminPage from './Components/AdminPage';
import Profile from './Components/Profile';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClarionCall />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/formpage" element={<FormPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatpage" element={<Chatpage />} />
        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;