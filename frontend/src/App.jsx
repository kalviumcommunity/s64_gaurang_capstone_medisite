import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Symptoms from './pages/Symptoms';
import Library from './pages/Library';
import ChatAssistant from './components/ChatAssistant';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth type="login" />} />
          <Route path="/signup" element={<Auth type="signup" />} />
          
          {/* Protected routes */}
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/symptoms" element={
            <PrivateRoute>
              <Symptoms />
            </PrivateRoute>
          } />
          <Route path="/library" element={
            <PrivateRoute>
              <Library />
            </PrivateRoute>
          } />
          {/* Chat page removed; floating assistant available on all pages */}

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* Floating assistant visible on all routes */}
        <ChatAssistant />
      </Router>
    </AuthProvider>
  );
}

export default App;
