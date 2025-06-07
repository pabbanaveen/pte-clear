import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import { User } from './types/user';
import { Header } from './components/Header';
import HomePage from './components/HomePage';
import LoginModal from './components/LoginModal';
import PracticeTests from './components/PracticeTests';
import Profile from './components/Profile';
import ProgressTracking from './components/ProgressTracking';
import StudyMaterials from './components/StudyMaterials';
import Dashboard from './components/Dashboard';
// import * as Components from './components';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (credentials: { email: string; password: string }) => {
    setUser({
      name: credentials.email.split('@')[0],
      email: credentials.email,
      avatar: 'https://images.pexels.com/photos/5303547/pexels-photo-5303547.jpeg',
      progress: {
        totalTests: 15,
        completedTests: 8,
        averageScore: 78,
        strongAreas: ['Reading', 'Listening'],
        weakAreas: ['Speaking', 'Writing'],
      }
    });
    setIsLoggedIn(true);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Header 
            isLoggedIn={isLoggedIn}
            user={user}
            onLoginClick={() => setLoginOpen(true)}
            onLogout={handleLogout}
          />
          <Routes>
            <Route 
              path="/" 
              element={
                isLoggedIn ? (
                  <Dashboard user={user} />
                ) : (
                  <HomePage onGetStarted={() => setLoginOpen(true)} />
                )
              } 
            />
            <Route 
              path="/practice" 
              element={<PracticeTests user={user} />} 
            />
            <Route 
              path="/materials" 
              element={<StudyMaterials user={user} />} 
            />
            <Route 
              path="/progress" 
              element={<ProgressTracking user={user} />} 
            />
            <Route 
              path="/profile" 
              element={<Profile user={user} setUser={setUser} />} 
            />
          </Routes>
          <LoginModal 
            open={loginOpen}
            onClose={() => setLoginOpen(false)}
            onLogin={handleLogin}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
