import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaBook, FaRobot, FaUser, FaCamera, FaSpinner, 
         FaWeight, FaRuler, FaCalendarAlt, FaVenusMars, FaHeartbeat } from 'react-icons/fa';
import Navigation from '../components/Navigation';
// Removed SearchHistory tabs to simplify the profile page
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const BACKEND_BASE_URL = import.meta?.env?.VITE_BACKEND_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_BASE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        // Try to parse server error for better feedback
        let message = 'Failed to fetch user data';
        try {
          const err = await response.json();
          message = err.message || message;
        } catch {}
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => navigate('/login'), 0);
        }
        throw new Error(message);
      }
      const data = await response.json();
      const resolvedPhoto = data?.profilePhoto
        ? (data.profilePhoto.startsWith('http')
            ? data.profilePhoto
            : `${BACKEND_BASE_URL}${data.profilePhoto}`)
        : '';
      const resolvedData = { ...data, profilePhoto: resolvedPhoto };
      setUserData(resolvedData);
      setEditedData(resolvedData);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size and type
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', file);

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_BASE_URL}/api/users/profile/photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const data = await response.json();
      // Create a local URL for immediate display and also prepare server URL for persistence
      const localUrl = URL.createObjectURL(file);
      const serverUrl = data?.profilePhoto
        ? (data.profilePhoto.startsWith('http')
            ? data.profilePhoto
            : `${BACKEND_BASE_URL}${data.profilePhoto}`)
        : '';
      setUserData(prev => ({
        ...prev,
        // Prefer server URL so it persists across reload; local URL is instant fallback
        profilePhoto: serverUrl || localUrl,
        serverPhotoUrl: serverUrl
      }));
      
      setUploadProgress(0);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error('Error uploading photo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedData(userData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editedData)
      });
      if (!response.ok) {
        let message = 'Failed to update profile';
        try { const err = await response.json(); message = err.message || message; } catch {}
        throw new Error(message);
      }
      const data = await response.json();
      setUserData(data);
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
      console.error('Error updating profile:', error);
    }
  };

  const calculateHealthScore = (userData) => {
    if (!userData) return 0;

    let score = 0;
    let metrics = 0;

    // BMI Calculation and Scoring (contributes 30%)
    if (userData.height && userData.weight) {
      const heightInMeters = userData.height / 100;
      const bmi = userData.weight / (heightInMeters * heightInMeters);
      
      // BMI scoring (18.5-24.9 is normal range)
      if (bmi >= 18.5 && bmi <= 24.9) {
        score += 30;
      } else if (bmi >= 17 && bmi < 18.5 || bmi > 24.9 && bmi <= 29.9) {
        score += 20;
      } else {
        score += 10;
      }
      metrics++;
    }

    // Age-based scoring (contributes 20%)
    if (userData.age) {
      if (userData.age >= 18 && userData.age <= 35) {
        score += 20;
      } else if (userData.age > 35 && userData.age <= 50) {
        score += 15;
      } else {
        score += 10;
      }
      metrics++;
    }

    // Medical conditions impact (contributes 30%)
    if (userData.medicalConditions) {
      const conditionCount = userData.medicalConditions.length;
      if (conditionCount === 0) {
        score += 30;
      } else if (conditionCount === 1) {
        score += 20;
      } else {
        score += 10;
      }
      metrics++;
    }

    // Profile completeness (contributes 20%)
    const requiredFields = ['name', 'age', 'gender', 'height', 'weight'];
    const completedFields = requiredFields.filter(field => userData[field]).length;
    const completenessScore = (completedFields / requiredFields.length) * 20;
    score += completenessScore;
    metrics++;

    // Calculate final score based on available metrics
    return Math.round((score / (metrics * 25)) * 100);
  };

  const renderHealthScore = (userData) => {
    const score = calculateHealthScore(userData);
    let scoreCategory = '';
    let scoreColor = '';

    if (score >= 90) {
      scoreCategory = 'Excellent';
      scoreColor = '#059669'; // green-600
    } else if (score >= 75) {
      scoreCategory = 'Good';
      scoreColor = '#0EA5E9'; // sky-500
    } else if (score >= 60) {
      scoreCategory = 'Fair';
      scoreColor = '#F59E0B'; // amber-500
    } else {
      scoreCategory = 'Needs Attention';
      scoreColor = '#DC2626'; // red-600
    }

    return (
      <div className="health-score-container">
        <div className="health-score-circle" style={{ '--score-color': scoreColor, '--percentage': score }}>
          <div className="health-score-inner">
            <div className="health-score-value">{score}%</div>
            <div className="health-score-category">{scoreCategory}</div>
          </div>
        </div>
        <div className="health-score-details">
          <h3>Health Score Breakdown</h3>
          <div className="score-metrics">
            {userData?.height && userData?.weight && (
              <div className="score-metric">
                <span>BMI Status</span>
                <div className="metric-bar">
                  <div 
                    className="metric-fill" 
                    style={{ 
                      width: `${(userData.weight / ((userData.height / 100) ** 2) >= 18.5 && 
                              userData.weight / ((userData.height / 100) ** 2) <= 24.9) ? '100%' : '50%'}`,
                      backgroundColor: scoreColor 
                    }}
                  />
                </div>
              </div>
            )}
            {userData?.age && (
              <div className="score-metric">
                <span>Age Factor</span>
                <div className="metric-bar">
                  <div 
                    className="metric-fill" 
                    style={{ 
                      width: `${userData.age >= 18 && userData.age <= 35 ? '100%' : '70%'}`,
                      backgroundColor: scoreColor 
                    }}
                  />
                </div>
              </div>
            )}
            <div className="score-metric">
              <span>Medical Status</span>
              <div className="metric-bar">
                <div 
                  className="metric-fill" 
                  style={{ 
                    width: `${userData?.medicalConditions?.length === 0 ? '100%' : '50%'}`,
                    backgroundColor: scoreColor 
                  }}
                />
              </div>
            </div>
            <div className="score-metric">
              <span>Profile Completeness</span>
              <div className="metric-bar">
                <div 
                  className="metric-fill" 
                  style={{ 
                    width: `${(Object.keys(userData || {}).length / 6) * 100}%`,
                    backgroundColor: scoreColor 
                  }}
                />
              </div>
            </div>
          </div>
          <div className="health-score-tips">
            <h4>Improvement Tips</h4>
            <ul>
              {!userData?.height || !userData?.weight ? (
                <li>Add your height and weight to calculate BMI</li>
              ) : null}
              {!userData?.age ? (
                <li>Add your age for better health assessment</li>
              ) : null}
              {!userData?.gender ? (
                <li>Specify your gender for personalized insights</li>
              ) : null}
              {Object.keys(userData || {}).length < 6 && (
                <li>Complete your profile for a more accurate score</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderMetricCard = (icon, title, value, unit = '') => {
    return (
      <div className="metric-card">
        {icon}
        <div className="metric-content">
          <h4>{title}</h4>
          <p>{value || 'Not specified'} {value ? unit : ''}</p>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (isLoading && !userData) {
      return (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading profile data...</p>
        </div>
      );
    }

    if (error && !userData) {
      return (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchUserData}>Retry</button>
        </div>
      );
    }

    // Single profile view (overview only)
    return (
          <div className="overview-section">
            <div className="profile-header">
              <div className="profile-photo-section">
                <div className="profile-photo">
                  {isLoading && (
                    <div className="upload-overlay">
                      <FaSpinner className="spinner" />
                      {uploadProgress > 0 && (
                        <div className="upload-progress">{uploadProgress}%</div>
                      )}
                    </div>
                  )}
                  {userData?.profilePhoto ? (
                    <img
                      src={userData.profilePhoto}
                      alt="Profile"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = userData.serverPhotoUrl || '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <div className="avatar">
                      <FaUser />
                    </div>
                  )}
                  <button 
                    className="photo-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload photo"
                  >
                    <FaCamera />
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                {error && <p className="error-message">{error}</p>}
              </div>
              
              <div className="profile-info">
                <h2>{userData?.name || 'User'}</h2>
                <p className="email">{userData?.email}</p>
                <div className="badges">
                  <span className="badge pink">Health Guide</span>
                  <span className="badge teal">Member</span>
                </div>
                <button 
                  className={`edit-button ${isEditing ? 'active' : ''}`} 
                  onClick={handleEditToggle}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            <div className="health-metrics-grid">
              {renderHealthScore(userData)}
              
              <div className="metrics-cards">
                {renderMetricCard(<FaCalendarAlt className="metric-icon" />, 'Age', userData?.age, 'years')}
                {renderMetricCard(<FaVenusMars className="metric-icon" />, 'Gender', userData?.gender)}
                {renderMetricCard(<FaRuler className="metric-icon" />, 'Height', userData?.height, 'cm')}
                {renderMetricCard(<FaWeight className="metric-icon" />, 'Weight', userData?.weight, 'kg')}
                {renderMetricCard(<FaHeartbeat className="metric-icon" />, 'Medical Conditions', 
                  userData?.medicalConditions?.join(', ') || 'None')}
              </div>
            </div>

            {isEditing && (
              <div className="edit-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editedData.name || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={editedData.age || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your age"
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={editedData.gender || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={editedData.height || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your height"
                    />
                  </div>
                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={editedData.weight || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your weight"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Medical Conditions</label>
                    <textarea
                      name="medicalConditions"
                      value={editedData.medicalConditions?.join(', ') || ''}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'medicalConditions',
                          value: e.target.value.split(',').map(item => item.trim())
                        }
                      })}
                      placeholder="Enter medical conditions (comma-separated)"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="save-button" onClick={handleSaveChanges}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        );
  };

  return (
    <div className="profile-page">
      <Navigation />
      <div className="profile-content">
        {/* Tabs removed to simplify the profile page */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile; 