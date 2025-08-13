import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPills, FaLeaf, FaHome, FaBook, FaRobot, FaUser, FaExclamationTriangle } from 'react-icons/fa';
import { GiMedicines, GiHerbsBundle } from 'react-icons/gi';
import { BiCheckCircle } from 'react-icons/bi';
import './MedicineLibrary.css';

const MedicineLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicineType, setMedicineType] = useState('allopathic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [medicineData, setMedicineData] = useState(null);

  // Common Allopathic Categories
  const allopathicCategories = [
    'Pain Relievers',
    'Antibiotics',
    'Antivirals',
    'Cardiovascular',
    'Respiratory',
    'Gastrointestinal',
    'Antidiabetics',
    'Antidepressants'
  ];

  // Common Ayurvedic Categories
  const ayurvedicCategories = [
    'Digestive Health',
    'Respiratory Care',
    'Joint & Pain Relief',
    'Immunity Boosters',
    'Skin Care',
    'Mental Wellness',
    'Women\'s Health',
    'General Wellness'
  ];

  // Ayurvedic Medicine Database
  const ayurvedicMedicines = {
    'Digestive Health': [
      {
        name: 'Triphala',
        description: 'A traditional ayurvedic formulation of three fruits',
        ingredients: ['Amalaki', 'Bibhitaki', 'Haritaki'],
        benefits: [
          'Improves digestion',
          'Supports regular elimination',
          'Cleanses the colon',
          'Reduces inflammation'
        ],
        dosage: '500-1000mg before bed',
        precautions: [
          'May cause loose stools initially',
          'Take on empty stomach',
          'Not recommended during pregnancy'
        ],
        contraindications: ['Pregnancy', 'Diarrhea'],
        interactions: ['May interact with blood thinners']
      }
    ],
    'Respiratory Care': [
      {
        name: 'Sitopaladi Churna',
        description: 'Traditional respiratory health formula',
        ingredients: ['Mishri', 'Vanslochan', 'Pippali', 'Ela', 'Dalchini'],
        benefits: [
          'Relieves cough and cold',
          'Reduces respiratory inflammation',
          'Supports bronchial health'
        ],
        dosage: '1/4 to 1/2 teaspoon twice daily with honey',
        precautions: [
          'Keep away from moisture',
          'Store in airtight container'
        ],
        contraindications: ['None known'],
        interactions: ['Can be taken with most medications']
      }
    ]
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const searchTerm = searchQuery.toLowerCase().trim();
    if (!searchTerm) {
      setError('Please enter a medicine name');
      setLoading(false);
      return;
    }

    const results = medicineType === 'allopathic' ? [
      {
        name: "Paracetamol",
        description: "Pain reliever and fever reducer",
        category: "Pain Relievers",
        dosage: "500-1000mg every 4-6 hours",
        warnings: "Do not exceed 4000mg in 24 hours"
      },
      {
        name: "Ibuprofen",
        description: "Non-steroidal anti-inflammatory drug",
        category: "Pain Relievers",
        dosage: "200-400mg every 4-6 hours",
        warnings: "Take with food to avoid stomach upset"
      }
    ] : ayurvedicMedicines['Digestive Health'].filter(med => 
      med.name.toLowerCase().includes(searchTerm) ||
      med.category.toLowerCase().includes(searchTerm)
    );

    if (results.length > 0) {
      setMedicineData(results[0]);
    } else {
      setError('No medicine found matching your search');
    }
    setLoading(false);
  };

  const handleCategoryClick = (category) => {
    setSearchQuery(category);
    handleSearch({ preventDefault: () => {} });
  };

  return (
    <div className="medicine-library-page">
      <nav className="nav-bar">
        <div className="nav-logo">
          <Link to="/">MediVerse</Link>
          <span className="subtitle">Medicine Library</span>
        </div>
        <div className="nav-links">
          <Link to="/"><FaHome /> Home</Link>
          <Link to="/symptoms"><FaSearch /> Symptoms</Link>
          <Link to="/library" className="active"><FaBook /> Medicine Library</Link>
          <Link to="/chat"><FaRobot /> Chat Assistant</Link>
          <Link to="/profile"><FaUser /> Profile</Link>
        </div>
      </nav>

      <header className="library-header">
        <h1>Medicine Library</h1>
        <p>Search and learn about both Allopathic and Ayurvedic medicines</p>
      </header>

      <section className="medicine-type-toggle">
        <button
          className={`type-button ${medicineType === 'allopathic' ? 'active' : ''}`}
          onClick={() => {
            setMedicineType('allopathic');
            setMedicineData(null);
            setError(null);
          }}
        >
          <FaPills /> Allopathic Medicines
        </button>
        <button
          className={`type-button ${medicineType === 'ayurvedic' ? 'active' : ''}`}
          onClick={() => {
            setMedicineType('ayurvedic');
            setMedicineData(null);
            setError(null);
          }}
        >
          <FaLeaf /> Ayurvedic Medicines
        </button>
      </section>

      <section className="search-section">
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-box">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-button">
              Search <FaSearch />
            </button>
          </form>
        </div>
      </section>

      <section className="categories-section">
        <h2>Browse by Category</h2>
        <div className="category-grid">
          {(medicineType === 'allopathic' ? allopathicCategories : ayurvedicCategories).map((category, index) => (
            <button 
              key={index} 
              className="category-card"
              onClick={() => handleCategoryClick(category)}
            >
              {medicineType === 'allopathic' ? <FaPills /> : <FaLeaf />}
              <span>{category}</span>
            </button>
          ))}
        </div>
      </section>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Searching for medicine information...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <FaExclamationTriangle />
          <p>{error}</p>
        </div>
      )}

      {medicineData && (
        <section className="medicine-details">
          <div className="medicine-card">
            <h2>{medicineData.name}</h2>
            
            {medicineType === 'allopathic' ? (
              <>
                <div className="info-section">
                  <h3>Purpose</h3>
                  <p>{medicineData.description}</p>
                </div>

                <div className="info-section">
                  <h3>Uses</h3>
                  <p>{medicineData.category}</p>
                </div>

                <div className="warning-section">
                  <h3><FaExclamationTriangle /> Warnings</h3>
                  <p>{medicineData.warnings}</p>
                </div>

                <div className="info-grid">
                  <div className="info-section">
                    <h3>Dosage</h3>
                    <p>{medicineData.dosage}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="info-section">
                  <h3>Description</h3>
                  <p>{medicineData.description}</p>
                </div>

                <div className="info-section">
                  <h3>Ingredients</h3>
                  <ul className="ingredients-list">
                    {medicineData.ingredients.map((ingredient, index) => (
                      <li key={index}><BiCheckCircle /> {ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className="info-section">
                  <h3>Benefits</h3>
                  <ul className="benefits-list">
                    {medicineData.benefits.map((benefit, index) => (
                      <li key={index}><BiCheckCircle /> {benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="info-grid">
                  <div className="info-section">
                    <h3>Dosage</h3>
                    <p>{medicineData.dosage}</p>
                  </div>
                </div>
              </>
            )}

            <div className="disclaimer">
              <FaExclamationTriangle />
              <p>This information is for educational purposes only. Always consult with a healthcare professional before taking any medication.</p>
            </div>
          </div>
        </section>
      )}

      <div className="sample-searches">
        <p>Try searching for: {
          medicineType === 'allopathic' 
            ? 'Paracetamol, Ibuprofen' 
            : 'Triphala, Ashwagandha'
        }</p>
      </div>
    </div>
  );
};

export default MedicineLibrary; 