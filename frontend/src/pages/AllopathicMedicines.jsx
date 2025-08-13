import React, { useState } from 'react';
import { FaSearch, FaPills, FaHospital, FaArrowLeft } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import acetaminophenImg from '../assets/medicines/acetaminophen.jpg';
import './AllopathicMedicines.css';

const AllopathicMedicines = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiResult, setApiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Common medicine categories
  const categories = ['All', 'Pain Relief', 'Antibiotics', 'Antiviral', 'Cardiovascular', 'Respiratory'];

  // Curated list of common medicines with detailed information
  const commonMedicines = [
    {
      name: 'Acetaminophen',
      category: 'Pain Relief',
      type: 'Pain Reliever',
      medicineType: 'Allopathic',
      image: acetaminophenImg,
      backgroundImage: acetaminophenImg,
      overview: 'Acetaminophen (500mg) is a widely used over-the-counter pain reliever and fever reducer. Available in 24-tablet packaging for oral use.',
      benefits: [
        'Reduces mild to moderate pain',
        'Lowers fever',
        "Doesn't irritate the stomach like NSAIDs",
        'Safe for most people when used as directed'
      ],
      usageInstructions: 'Adults: 500mg every 4-6 hours as needed, not to exceed 4000mg in 24 hours.',
      precautions: [
        'Liver damage can occur with excessive use',
        'Avoid alcohol when taking this medication',
        'Not recommended for long-term pain management without medical supervision',
        'Check for acetaminophen in other medications to avoid overdose'
      ],
      dosageForm: 'Tablet',
      strength: '500mg',
      quantity: '24 tablets',
      commonBrands: ['Tylenol', 'Panadol', 'Calpol']
    },
    {
      name: 'Amoxicillin',
      category: 'Antibiotics',
      type: 'Antibiotic',
      medicineType: 'Allopathic',
      image: '/medicines/amoxicillin.jpg',
      backgroundImage: '/medicines/amoxicillin-bg.jpg',
      overview: 'Amoxicillin is a penicillin antibiotic that fights bacteria in the body. It is used to treat many different types of infection.',
      benefits: [
        'Treats various bacterial infections',
        'Well-tolerated by most patients',
        'Can be taken with or without food',
        'Available in multiple forms'
      ],
      usageInstructions: 'Typical adult dose: 250-500mg every 8 hours or 500-875mg every 12 hours. Complete the full course as prescribed.',
      precautions: [
        'May cause allergic reactions in penicillin-sensitive individuals',
        'Complete the full prescribed course',
        'May reduce effectiveness of birth control pills',
        'Tell your doctor about any allergies'
      ],
      dosageForm: 'Capsule',
      commonBrands: ['Amoxil', 'Moxatag', 'Amoxil Suspension']
    },
    {
      name: 'Ibuprofen',
      category: 'Pain Relief',
      type: 'Anti-inflammatory',
      medicineType: 'Allopathic',
      image: '/medicines/ibuprofen.jpg',
      backgroundImage: '/medicines/ibuprofen-bg.jpg',
      overview: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID). It reduces hormones that cause inflammation, pain, and fever.',
      benefits: [
        'Reduces inflammation',
        'Relieves pain',
        'Lowers fever',
        'Works quickly when taken as directed'
      ],
      usageInstructions: 'Adults: 200-400mg every 4-6 hours as needed, not exceeding 1,200mg in 24 hours unless directed by a doctor.',
      precautions: [
        'May increase risk of heart attack or stroke',
        'Can cause stomach bleeding',
        'Use lowest effective dose',
        'Not recommended during last 3 months of pregnancy'
      ],
      dosageForm: 'Tablet',
      commonBrands: ['Advil', 'Motrin', 'Nuprin']
    }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setApiResult(null);
    
    try {
      const response = await fetch(
        `https://dailymed.nlm.nih.gov/dailymed/services/v2/drugname.json?drug_name=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error('Failed to fetch drug details');
      const data = await response.json();
      setApiResult(data);
    } catch (err) {
      setError('Unable to fetch drug details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = commonMedicines.filter(medicine =>
    selectedCategory === 'all' || medicine.category === selectedCategory
  );

  if (selectedMedicine) {
    return (
      <div className="medicine-detail-page">
        <div className="medicine-detail-hero" style={{
          backgroundImage: `url(${selectedMedicine.backgroundImage})`,
        }}>
          <div className="hero-overlay">
            <div className="back-navigation">
              <button onClick={() => setSelectedMedicine(null)} className="back-button">
                <FaArrowLeft /> Back to Library
              </button>
            </div>
            
            <div className="medicine-main-info">
              <h1>{selectedMedicine.name}</h1>
              <span className="medicine-type">{selectedMedicine.type}</span>
              <div className="medicine-badge">{selectedMedicine.medicineType} Medicine</div>
            </div>
          </div>
        </div>

        <div className="medicine-detail-content">
          <div className="medicine-detail-grid">
            <div className="medicine-detail-main">
              <section className="detail-section overview-section">
                <div className="medicine-image">
                  <img src={selectedMedicine.image} alt={selectedMedicine.name} />
                </div>
                <h2>Overview</h2>
                <p>{selectedMedicine.overview}</p>
                {selectedMedicine.commonBrands && (
                  <div className="common-brands">
                    <h3>Common Brands</h3>
                    <div className="brand-tags">
                      {selectedMedicine.commonBrands.map((brand, index) => (
                        <span key={index} className="brand-tag">{brand}</span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section className="detail-section">
                <h2>Benefits</h2>
                <ul className="benefits-list">
                  {selectedMedicine.benefits.map((benefit, index) => (
                    <li key={index}>
                      <BiCheckCircle className="benefit-icon" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="detail-section">
                <h2>Usage Instructions</h2>
                <div className="usage-card">
                  <FaPills className="usage-icon" />
                  <p>{selectedMedicine.usageInstructions}</p>
                </div>
              </section>

              <section className="detail-section">
                <h2>Precautions</h2>
                <ul className="precautions-list">
                  {selectedMedicine.precautions.map((precaution, index) => (
                    <li key={index}>
                      <BiErrorCircle className="precaution-icon" />
                      {precaution}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="medicine-detail-sidebar">
              <div className="info-card dosage-form">
                <FaHospital className="card-icon" />
                <h3>Dosage Form</h3>
                <p>{selectedMedicine.dosageForm}</p>
              </div>

              <div className="info-card category">
                <GiMedicines className="card-icon" />
                <h3>Category</h3>
                <p>{selectedMedicine.category}</p>
              </div>

              <div className="disclaimer">
                <BiErrorCircle className="disclaimer-icon" />
                <p>Information provided is for educational purposes only. Consult with a healthcare provider before starting any new medication or treatment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="allopathic-page">
      <header className="allopathic-header">
        <h1>Allopathic Medicines</h1>
        <p>Explore modern medicine treatments and their uses</p>
      </header>

      <section className="search-section">
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <div className="search-box">
              <div className="search-input-wrapper">
                <div className="search-icon-wrapper">
                  <FaSearch className="search-icon" />
                </div>
                <input
                  type="text"
                  placeholder="Search for any medicine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit">
                <FaSearch />
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category.toLowerCase() ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.toLowerCase())}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {loading && <div className="loading">Searching...</div>}
      {error && <div className="error-message">{error}</div>}

      <section className="common-medicines">
        <h2>Common Medicines</h2>
        <div className="medicines-grid">
          {filteredMedicines.map((medicine, idx) => (
            <div 
              key={idx} 
              className="medicine-card" 
              onClick={() => setSelectedMedicine(medicine)}
              style={{ backgroundImage: `url(${medicine.backgroundImage})` }}
            >
              <img 
                src={medicine.image} 
                alt={medicine.name} 
                className="medicine-thumbnail"
              />
              <div className="card-content">
                <div className="card-icon"><GiMedicines /></div>
                <h3>{medicine.name}</h3>
                <span className="category-tag">{medicine.category}</span>
                <p className="description">{medicine.overview}</p>
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {apiResult && apiResult.data && apiResult.data.length > 0 && (
        <section className="search-results">
          <h2>Search Results for "{searchQuery}"</h2>
          <div className="results-grid">
            {apiResult.data.map((item, idx) => (
              <div key={idx} className="result-card">
                <div className="card-icon"><FaPills /></div>
                <h3>{item.drug_name}</h3>
                <div className="details">
                  <p><strong>Set ID:</strong> {item.setid}</p>
                  <p><strong>RXCUI:</strong> {item.rxcui}</p>
                </div>
                <a 
                  href={`https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${item.setid}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-details-btn"
                >
                  View Full Details
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AllopathicMedicines; 