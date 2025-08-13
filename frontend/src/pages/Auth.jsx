import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Auth = ({ type }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const isSignup = type === 'signup';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignup && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      if (isSignup) {
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      } else {
        await login(formData.email, formData.password);
      }
      // After successful login/signup, redirect to landing page
      navigate('/');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred during authentication');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg"></div>
      <div className="auth-overlay"></div>
      
      <div className="auth-card">
        <div className="auth-avatar">
          {isSignup ? '👋' : '🔐'}
        </div>
        
        <div className="auth-header">
          <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isSignup ? 'Join our medical community' : 'Login to your account'}</p>
        </div>

        {error && (
          <div className="auth-error">
            {error.includes('<!DOCTYPE') 
              ? 'Server error: Please try again later or contact support.' 
              : error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Full Name</label>
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Email Address</label>
          </div>

          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Password</label>
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                data-tooltip={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
          </div>

          {isSignup && (
            <div className="form-group">
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label>Confirm Password</label>
              </div>
            </div>
          )}

          <button type="submit" className="auth-btn">
            {isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          {isSignup ? (
            <>Already have an account? <Link to="/login">Login</Link></>
          ) : (
            <>Don't have an account? <Link to="/signup">Sign up</Link></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth; 