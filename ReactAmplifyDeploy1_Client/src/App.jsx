import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Components/Signup';
import Home from './Components/Home';
import Login from './Components/Login';
import Chatpage from './Components/Chatpage';
import FormPage from './Components/FormPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
   <Route path="/signup" element={<Signup />} /> 
    <Route path="/formpage/:token" element={<FormPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/chatpage" element={<Chatpage />} /> 
  </Routes>
</BrowserRouter>

  );
}

export default App;