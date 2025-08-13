import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      // Show success message
      setSuccess(true);
      setIsAuthenticated(true);

      // Redirect after a short delay for animation
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      setError(error.message);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className={`login-container ${success ? 'success' : ''}`}>
        <div className="login-header">
          <h1>MediVerse</h1>
          <p className="subtitle">Health Guide</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Welcome Back</h2>
          <p className="form-subtitle">Please sign in to continue</p>

          {error && <div className="error-message">{error}</div>}
          
          {success ? (
            <div className="success-message">
              <FaCheckCircle />
              <p>Login successful! Redirecting to your profile...</p>
            </div>
          ) : (
            <>
              <div className="form-group">
                <div className="input-group">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              <p className="register-link">
                Don't have an account?{' '}
                <Link to="/register">Create Account</Link>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login; 