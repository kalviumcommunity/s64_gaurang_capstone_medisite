import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';
import doctorBg from '../assets/doctor-bg.jpg';
import SearchBar from '../components/SearchBar';

// Import icons (you'll need to install react-icons package)
import { FaHome, FaSearch, FaBook, FaRobot, FaUser, FaHeart, FaShieldAlt, FaUsers, FaGlobe, FaBookOpen } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';
import { GiMedicines, GiHerbsBundle } from 'react-icons/gi';
import { MdOutlineHealthAndSafety } from 'react-icons/md';

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/symptoms?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    // Handle chat submission here
    console.log('Chat message:', chatMessage);
    setChatMessage('');
  };

  const handleAyurvedicExplore = () => {
    navigate('/library?type=ayurvedic');
  };

  const handleAllopathicExplore = () => {
    navigate('/library?type=allopathic');
  };

  const handleViewDetails = (medicineName) => {
    navigate(`/library/${encodeURIComponent(medicineName)}`);
  };

  const medicines = [
    {
      name: 'Acetaminophen',
      type: 'Pain Reliever',
      description: 'Reduces fever and relieves mild to moderate pain.',
    },
    {
      name: 'Amoxicillin',
      type: 'Antibiotic',
      description: 'Treats various bacterial infections.',
    },
    {
      name: 'Ibuprofen',
      type: 'Anti-inflammatory',
      description: 'Reduces inflammation, pain and fever.',
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-logo">
          <Link to="/">MediVerse</Link>
          <span className="subtitle">Health Guide</span>
        </div>
        <div className="nav-links">
          <Link to="/"><FaHome /> Home</Link>
          <Link to="/symptoms"><FaSearch /> Symptoms</Link>
          <Link to="/library"><FaBook /> Medicine Library</Link>
          <Link to="/chat"><FaRobot /> Chat Assistant</Link>
          <Link to="/profile"><FaUser /> Profile</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Your Health, <span className="gradient-text">Our Priority</span>
            </h1>
            <p className="hero-subtitle">
              Discover comprehensive health information with AI-powered insights, 
              traditional wisdom, and modern medicine all in one place.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">11+</span>
                <span className="stat-label">Common Symptoms</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">Medicines</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">AI</span>
                <span className="stat-label">Powered</span>
              </div>
            </div>
          </div>
          <div className="hero-search">
            <div className="search-container">
              <h2>Find Health Information</h2>
              <p>Search for symptoms, medicines, or health conditions</p>
              <SearchBar
                placeholder="Search symptoms, medicines, or health conditions..."
                value={searchQuery}
                onChange={handleSearchChange}
                onSubmit={handleSearch}
                onClear={handleSearchClear}
                size="large"
              />
              <div className="search-suggestions">
                <span className="suggestion-label">Popular searches:</span>
                <div className="suggestion-tags">
                  <button className="suggestion-tag">Headache</button>
                  <button className="suggestion-tag">Fever</button>
                  <button className="suggestion-tag">Cough</button>
                  <button className="suggestion-tag">Pain Relief</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="features-showcase">
        <div className="features-container">
          <div className="features-header">
            <h2>Comprehensive Health Solutions</h2>
            <p>Everything you need for your health journey in one platform</p>
          </div>
          <div className="features-grid">
            <div className="feature-card primary">
              <div className="feature-icon">
                <FaSearch />
              </div>
              <h3>Symptom Checker</h3>
              <p>AI-powered symptom analysis with detailed information about causes, treatments, and when to seek help.</p>
              <div className="feature-highlights">
                <span className="highlight">11+ Common Symptoms</span>
                <span className="highlight">AI Insights</span>
                <span className="highlight">Urgency Levels</span>
              </div>
              <Link to="/symptoms" className="feature-cta">
                Check Symptoms <BsArrowRight />
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaBook />
              </div>
              <h3>Medicine Library</h3>
              <p>Comprehensive database of both traditional and modern medicines with detailed information.</p>
              <div className="feature-highlights">
                <span className="highlight">Ayurvedic & Allopathic</span>
                <span className="highlight">Detailed Dosages</span>
                <span className="highlight">Side Effects</span>
              </div>
              <Link to="/library" className="feature-cta">
                Explore Library <BsArrowRight />
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaRobot />
              </div>
              <h3>AI Health Assistant</h3>
              <p>Get instant answers to your health questions with our advanced AI-powered chat assistant.</p>
              <div className="feature-highlights">
                <span className="highlight">24/7 Available</span>
                <span className="highlight">Instant Answers</span>
                <span className="highlight">Personalized</span>
              </div>
              <Link to="/chat" className="feature-cta">
                Start Chatting <BsArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      

      {/* Medicine Library Preview Section */}
      <section className="medicine-preview">
        <div className="medicine-container">
          <div className="medicine-header">
            <h2>Explore Our Medicine Library</h2>
            <p>Discover detailed information about medicines from both traditional and modern approaches</p>
          </div>
          <div className="medicine-showcase">
            <div className="medicine-categories">
              <div className="category-tab active">
                <GiMedicines className="category-icon" />
                <span>Allopathic</span>
              </div>
              <div className="category-tab">
                <GiHerbsBundle className="category-icon" />
                <span>Ayurvedic</span>
              </div>
            </div>
            <div className="medicines-grid">
              {medicines.map((medicine, index) => (
                <div key={index} className="medicine-card">
                  <div className="medicine-header">
                    <h3>{medicine.name}</h3>
                    <span className="medicine-type">{medicine.type}</span>
                  </div>
                  <p className="medicine-description">{medicine.description}</p>
                  <div className="medicine-actions">
                    <button className="view-details-btn" onClick={() => handleViewDetails(medicine.name)}>
                      View Details <BsArrowRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="medicine-cta">
              <button className="explore-library-btn" onClick={() => navigate('/library')}>
                Explore Full Library
                <BsArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <h2>What Our Users Say</h2>
            <p>Real experiences from people who trust MediVerse for their health information</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The symptom checker helped me understand my condition better. The AI insights were incredibly helpful!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">S</div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <span>Health Enthusiast</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"I love how MediVerse combines traditional Ayurvedic wisdom with modern medicine. It's comprehensive!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">R</div>
                <div className="author-info">
                  <h4>Raj Patel</h4>
                  <span>Wellness Advocate</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The AI assistant answered all my questions instantly. It's like having a doctor available 24/7!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">M</div>
                <div className="author-info">
                  <h4>Michael Chen</h4>
                  <span>Tech Professional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Health Assistant Section */}
      <section className="ai-assistant">
        <div className="ai-container">
          <div className="ai-content">
            <div className="ai-text">
              <h2>Meet Your AI Health Assistant</h2>
              <p>Get instant, personalized answers to your health questions with our advanced AI-powered assistant.</p>
              <div className="ai-features">
                <div className="ai-feature">
                  <div className="feature-icon">🤖</div>
                  <span>24/7 Available</span>
                </div>
                <div className="ai-feature">
                  <div className="feature-icon">⚡</div>
                  <span>Instant Responses</span>
                </div>
                <div className="ai-feature">
                  <div className="feature-icon">🎯</div>
                  <span>Personalized</span>
                </div>
              </div>
              <Link to="/chat" className="ai-cta">
                Start Chatting Now
                <BsArrowRight />
              </Link>
            </div>
            <div className="ai-demo">
              <div className="chat-preview">
                <div className="chat-header">
                  <div className="chat-avatar">AI</div>
                  <div className="chat-info">
                    <h4>MediVerse Assistant</h4>
                    <span>Online</span>
                  </div>
                </div>
                <div className="chat-messages-preview">
                  <div className="message assistant">
                    Hi! I'm your MediVerse Health Assistant. How can I help you today?
                  </div>
                  <div className="message user">
                    What are the symptoms of high blood pressure?
                  </div>
                  <div className="message assistant">
                    High blood pressure often has no symptoms, but when present, they may include headaches, shortness of breath, or nosebleeds...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>MediVerse</h3>
              <p>Bridging ancient wisdom and modern medicine for comprehensive health information.</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Features</h4>
                <Link to="/symptoms">Symptom Checker</Link>
                <Link to="/library">Medicine Library</Link>
                <Link to="/chat">AI Assistant</Link>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <Link to="/">Health Guides</Link>
                <Link to="/">Treatment Info</Link>
                <Link to="/">Wellness Tips</Link>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <Link to="/">Help Center</Link>
                <Link to="/">Contact Us</Link>
                <Link to="/">Privacy Policy</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 MediVerse Health Guide. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 