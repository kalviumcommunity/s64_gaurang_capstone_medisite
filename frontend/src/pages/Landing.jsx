import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';
import doctorBg from '../assets/doctor-bg.jpg';
import SearchBar from '../components/SearchBar';

// Import icons (you'll need to install react-icons package)
import { FaHome, FaSearch, FaBook, FaRobot, FaUser } from 'react-icons/fa';
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
    <div className="landing-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Your Health, Our Priority</h1>
          <p>Find the best medical information and connect with healthcare professionals</p>
          <div className="search-form">
            <SearchBar
              placeholder="Search for symptoms, conditions, or treatments..."
              value={searchQuery}
              onChange={handleSearchChange}
              onSubmit={handleSearch}
              onClear={handleSearchClear}
              size="large"
            />
          </div>
        </div>
        <div className="hero-overlay"></div>
      </div>

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

      {/* Healing Pathways Section */}
      <section className="healing-pathways">
        <h2>Choose Your Healing Pathway</h2>
        <div className="pathways-container">
          <div className="pathway-card ayurvedic">
            <div className="icon"><GiHerbsBundle /></div>
            <h3>Ayurvedic Medicine</h3>
            <p>Traditional healing system with roots in ancient India</p>
            <ul>
              <li>Holistic healing approach</li>
              <li>Natural herbal treatments</li>
              <li>Balance of mind, body, and spirit</li>
              <li>Personalized wellness plans</li>
            </ul>
            <button className="explore-btn" onClick={handleAyurvedicExplore}>Explore Ayurvedic Remedies</button>
          </div>

          <div className="pathway-card allopathic">
            <div className="icon"><GiMedicines /></div>
            <h3>Allopathic Medicine</h3>
            <p>Modern conventional medical treatment system</p>
            <ul>
              <li>Evidence-based treatments</li>
              <li>Pharmaceutical medications</li>
              <li>Advanced diagnostic tools</li>
              <li>Surgical interventions</li>
            </ul>
            <button className="explore-btn" onClick={handleAllopathicExplore}>Explore Allopathic Treatments</button>
          </div>
        </div>
      </section>

      {/* Medicine Library Section */}
      <section className="medicine-library">
        <h2>Explore Our Medicine Library</h2>
        <div className="search-filters">
          <button className="filter-btn active">Allopathic</button>
          <button className="filter-btn">Ayurvedic</button>
        </div>
        <div className="medicines-grid">
          {medicines.map((medicine, index) => (
            <div key={index} className="medicine-card">
              <h3>{medicine.name}</h3>
              <span className="type">{medicine.type}</span>
              <p>{medicine.description}</p>
              <button className="view-details" onClick={() => handleViewDetails(medicine.name)}>
                View Details <BsArrowRight />
              </button>
            </div>
          ))}
        </div>
        <button className="view-all" onClick={() => navigate('/library')}>View All Medicines</button>
      </section>

      {/* AI Health Assistant Section */}
      <section className="ai-assistant">
        <h2>AI Health Assistant</h2>
        <p>Ask questions about symptoms, medicines, or health concerns</p>
        <div className="chat-container">
          <div className="chat-messages">
            <div className="assistant-message">
              Hi there! I'm your MediVerse Health Assistant. How can I help you today?
            </div>
          </div>
          <form onSubmit={handleChatSubmit} className="chat-input">
            <input
              type="text"
              placeholder="Type your question..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="offerings">
        <h2>What We Offer</h2>
        <div className="offerings-grid">
          <div className="offering-card">
            <div className="icon"><MdOutlineHealthAndSafety /></div>
            <h3>Symptom Checker</h3>
            <p>Search and identify potential causes for your symptoms</p>
          </div>
          <div className="offering-card">
            <div className="icon"><FaBook /></div>
            <h3>Medical Library</h3>
            <p>Comprehensive information about medicines and treatments</p>
          </div>
          <div className="offering-card">
            <div className="icon"><FaRobot /></div>
            <h3>Treatment Guides</h3>
            <p>Step-by-step guides for managing common health conditions</p>
          </div>
        </div>
      </section>

      <footer>
        <p>"MediVerse Health Guide bridges ancient wisdom and modern medicine to provide you with comprehensive health information"</p>
      </footer>
    </div>
  );
};

export default Landing; 