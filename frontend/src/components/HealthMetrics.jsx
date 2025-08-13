import React, { useState, useEffect } from 'react';
import { FaUserMd, FaHospital, FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeartbeat } from 'react-icons/fa';
import './HealthMetrics.css';

const HealthMetrics = () => {
  const [symptoms, setSymptoms] = useState('');
  const [preferredMedicine, setPreferredMedicine] = useState('both');
  const [specialization, setSpecialization] = useState('');
  const [location, setLocation] = useState('');
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState({
    bmi: 0,
    bloodPressure: '120/80',
    heartRate: 72,
    bloodSugar: 90,
    cholesterol: 180,
    score: 85
  });

  // Sample doctor data (replace with actual API call)
  const sampleDoctors = [
    {
      id: 1,
      name: "Dr. Sharma",
      specialization: "General Physician",
      experience: 15,
      rating: 4.8,
      medicineType: "both",
      location: "Mumbai",
      phone: "+91 98765 43210",
      email: "dr.sharma@example.com",
      address: "123 Healthcare Avenue, Mumbai",
      availability: "Mon-Sat: 10:00 AM - 7:00 PM",
      image: "https://example.com/dr-sharma.jpg"
    },
    {
      id: 2,
      name: "Dr. Ayush Patel",
      specialization: "Ayurvedic Practitioner",
      experience: 12,
      rating: 4.6,
      medicineType: "ayurvedic",
      location: "Delhi",
      phone: "+91 98765 43211",
      email: "dr.patel@example.com",
      address: "456 Wellness Street, Delhi",
      availability: "Mon-Fri: 9:00 AM - 6:00 PM",
      image: "https://example.com/dr-patel.jpg"
    }
  ];

  const specializations = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Ayurvedic Practitioner",
    "Homeopath",
    "Pediatrician",
    "Orthopedic",
    "Neurologist",
    "Psychiatrist",
    "Dentist"
  ];

  // Save search to history
  const saveToSearchHistory = async (searchQuery, type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/users/search-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: searchQuery,
          type: type,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save search history');
      }
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Save the symptom search to history
    if (symptoms.trim()) {
      await saveToSearchHistory(symptoms, preferredMedicine === 'ayurvedic' ? 'ayurvedic' : 'allopathic');
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter doctors based on form inputs
      const filteredDoctors = sampleDoctors.filter(doctor => {
        const matchesType = preferredMedicine === 'both' || doctor.medicineType === preferredMedicine;
        const matchesSpecialization = !specialization || doctor.specialization === specialization;
        const matchesLocation = !location || doctor.location.toLowerCase().includes(location.toLowerCase());
        return matchesType && matchesSpecialization && matchesLocation;
      });

      setRecommendedDoctors(filteredDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add health metrics section at the top
  const renderHealthMetrics = () => (
    <div className="health-metrics-summary">
      <h2>Your Health Metrics</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <FaHeartbeat />
          </div>
          <div className="metric-details">
            <h4>Health Score</h4>
            <div className="metric-value">{healthMetrics.score}%</div>
            <div className={`score-indicator ${healthMetrics.score >= 80 ? 'excellent' : 
              healthMetrics.score >= 60 ? 'good' : 
              healthMetrics.score >= 40 ? 'fair' : 'poor'}`}>
              {healthMetrics.score >= 80 ? 'Excellent' : 
               healthMetrics.score >= 60 ? 'Good' : 
               healthMetrics.score >= 40 ? 'Fair' : 'Needs Attention'}
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-details">
            <h4>BMI</h4>
            <div className="metric-value">{healthMetrics.bmi}</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-details">
            <h4>Blood Pressure</h4>
            <div className="metric-value">{healthMetrics.bloodPressure}</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-details">
            <h4>Heart Rate</h4>
            <div className="metric-value">{healthMetrics.heartRate} bpm</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-details">
            <h4>Blood Sugar</h4>
            <div className="metric-value">{healthMetrics.bloodSugar} mg/dL</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-details">
            <h4>Cholesterol</h4>
            <div className="metric-value">{healthMetrics.cholesterol} mg/dL</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="health-metrics-container">
      {renderHealthMetrics()}
      <div className="health-metrics-content">
        <div className="health-metrics-form-section">
          <h2>Find Recommended Doctors</h2>
          <p>Fill in your preferences to get personalized doctor recommendations</p>

          <form onSubmit={handleSubmit} className="doctor-search-form">
            <div className="form-group">
              <label>Describe Your Symptoms</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms or health concerns..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Preferred Medicine Type</label>
              <select
                value={preferredMedicine}
                onChange={(e) => setPreferredMedicine(e.target.value)}
              >
                <option value="both">Both Allopathic & Ayurvedic</option>
                <option value="allopathic">Allopathic Only</option>
                <option value="ayurvedic">Ayurvedic Only</option>
              </select>
            </div>

            <div className="form-group">
              <label>Specialization</label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option value="">Any Specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or area"
              />
            </div>

            <button type="submit" className="search-doctors-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Find Doctors'}
            </button>
          </form>
        </div>

        <div className="recommended-doctors-section">
          <h3>Recommended Doctors</h3>
          
          {loading ? (
            <div className="loading-doctors">
              <div className="spinner"></div>
              <p>Finding the best doctors for you...</p>
            </div>
          ) : recommendedDoctors.length > 0 ? (
            <div className="doctors-grid">
              {recommendedDoctors.map(doctor => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-header">
                    <div className="doctor-avatar">
                      <FaUserMd />
                    </div>
                    <div className="doctor-info">
                      <h4>{doctor.name}</h4>
                      <p className="specialization">{doctor.specialization}</p>
                      <div className="rating">
                        <FaStar className="star-icon" />
                        <span>{doctor.rating}</span>
                        <span className="experience">
                          {doctor.experience} years experience
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="doctor-details">
                    <div className="detail-item">
                      <FaHospital />
                      <span>{doctor.medicineType === 'both' ? 'Allopathic & Ayurvedic' : doctor.medicineType}</span>
                    </div>
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="detail-item">
                      <FaPhone />
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="detail-item">
                      <FaEnvelope />
                      <span>{doctor.email}</span>
                    </div>
                  </div>

                  <div className="doctor-footer">
                    <p className="availability">{doctor.availability}</p>
                    <button className="book-appointment-btn">
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-doctors">
              <FaUserMd className="no-doctors-icon" />
              <p>No doctors found matching your criteria</p>
              <p className="no-doctors-sub">Try adjusting your search preferences</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthMetrics; 