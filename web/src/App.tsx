import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AudioRecorder from './components/AudioRecorder';
import LoginForm from './components/LoginForm';
import './App.css';
import { supabase } from './supabase-client'

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [session, setSession] = useState<any>(null);

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    setSession(currentSession.data)
  }

  useEffect(() => {
    fetchSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  return (
    <div className="App">
      <center><p>{session ? "logged in" : "logged out"}</p></center>
      <Router>
        <Routes>
          <Route path="/" element={session ? <AudioRecorder durationSeconds={60} sampleWidth={2} /> : <Navigate to="/login" />} />
          <Route path="/login" element={session ? <Navigate to="/" /> : <LoginForm onLoginSuccess={fetchSession} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;