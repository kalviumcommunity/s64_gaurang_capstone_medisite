import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_BASE_URL = import.meta?.env?.VITE_BACKEND_URL || 'http://localhost:5001';

  useEffect(() => {
    // Check for existing token and user data in localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Improved error handling - check if response can be parsed as JSON
        try {
          const error = await response.json();
          throw new Error(error.message || 'Login failed');
        } catch (jsonError) {
          // If JSON parsing fails, use response text instead
          const errorText = await response.text();
          throw new Error('Server error: ' + (errorText.slice(0, 100) || 'Login failed'));
        }
      }

      const data = await response.json();
      
      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        // Improved error handling - check if response can be parsed as JSON
        try {
          const error = await response.json();
          throw new Error(error.message || 'Signup failed');
        } catch (jsonError) {
          // If JSON parsing fails, use response text instead
          const errorText = await response.text();
          throw new Error('Server error: ' + (errorText.slice(0, 100) || 'Signup failed'));
        }
      }
      
      const data = await response.json();
      
      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 