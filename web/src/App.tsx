import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AudioStreamer from './components/AudioStreamer';
import LoginForm from './components/LoginForm';
import './App.css';

function App() {
  const [isStreaming, setIsStreaming] = useState<boolean>(false); 
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={loggedIn ? <AudioStreamer /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;