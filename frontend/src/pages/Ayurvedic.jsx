import React, { useState, useEffect } from 'react';
import { FaSearch, FaLeaf, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { GiMedicinePills, GiHerbsBundle } from 'react-icons/gi';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import './Ayurvedic.css';

const Ayurvedic = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiResult, setApiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Common Ayurvedic categories
  const categories = ['All', 'Herbs', 'Formulations', 'Rasayanas', 'Digestive', 'Immunity'];

  // Curated list of common Ayurvedic medicines with detailed information
  const commonMedicines = [
    {
      name: 'Ashwagandha',
      category: 'Herbs',
      type: 'Adaptogenic Herb',
      medicineType: 'Ayurvedic',
      image: '/medicines/ashwagandha.jpg',
      backgroundImage: '/medicines/ashwagandha-bg.jpg',
      overview: 'Ashwagandha (Withania somnifera) is one of the most important herbs in Ayurveda, used for its adaptogenic and rejuvenating properties.',
      benefits: [
        'Reduces stress and anxiety',
        'Improves strength and stamina',
        'Enhances immune function',
        'Supports healthy sleep patterns'
      ],
      usageInstructions: 'Adults: 300-500mg twice daily with meals. Best taken as a supplement or mixed with warm milk.',
      precautions: [
        'Consult healthcare provider if pregnant or nursing',
        'May interact with thyroid medications',
        'Not recommended for autoimmune conditions',
        'Discontinue use 2 weeks before surgery'
      ],
      dosageForm: 'Powder/Capsule',
      commonBrands: ['Organic India', 'Himalaya', 'Dabur']
    },
    {
      name: 'Triphala',
      category: 'Formulations',
      type: 'Herbal Blend',
      medicineType: 'Ayurvedic',
      image: '/medicines/triphala.jpg',
      backgroundImage: '/medicines/triphala-bg.jpg',
      overview: 'Triphala is a traditional Ayurvedic formulation consisting of three fruits: Amalaki, Bibhitaki, and Haritaki. It supports digestion and detoxification.',
      benefits: [
        'Supports digestive health',
        'Natural gentle detoxifier',
        'Improves eye health',
        'Rich in antioxidants'
      ],
      usageInstructions: 'Take 500-1000mg before bed with warm water. Start with a lower dose and gradually increase.',
      precautions: [
        'May cause loose stools initially',
        'Take on empty stomach',
        'Not recommended during pregnancy',
        'Consult physician if taking medications'
      ],
      dosageForm: 'Powder/Tablet',
      commonBrands: ['Dabur', 'Himalaya', 'Kerala Ayurveda']
    }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setApiResult(null);
    
    try {
      // Using the NutritionIX API for herb information (you'll need to replace with your preferred API)
      const response = await fetch(
        `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'x-app-id': process.env.REACT_APP_NUTRITIONIX_APP_ID,
            'x-app-key': process.env.REACT_APP_NUTRITIONIX_APP_KEY
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch herb details');
      const data = await response.json();
      setApiResult(data);
    } catch (err) {
      setError('Unable to fetch herb details. Please try again.');
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
                  <FaLeaf className="usage-icon" />
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
                <GiHerbsBundle className="card-icon" />
                <h3>Dosage Form</h3>
                <p>{selectedMedicine.dosageForm}</p>
              </div>

              <div className="info-card category">
                <FaLeaf className="card-icon" />
                <h3>Category</h3>
                <p>{selectedMedicine.category}</p>
              </div>

              <div className="disclaimer">
                <BiErrorCircle className="disclaimer-icon" />
                <p>Information provided is for educational purposes only. Consult with an Ayurvedic practitioner before starting any new treatment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ayurvedic-page">
      <header className="ayurvedic-header">
        <h1>Ayurvedic Medicines</h1>
        <p>Explore traditional healing wisdom and natural remedies</p>
      </header>

      <section className="search-section">
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-bar">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for Ayurvedic medicines or herbs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
          <div className="categories">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category.toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.toLowerCase())}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading && <div className="loading">Searching...</div>}
      {error && <div className="error">{error}</div>}

      <section className="medicines-section">
        <h2>Common Ayurvedic Medicines</h2>
        <div className="medicines-grid">
          {filteredMedicines.map((medicine, idx) => (
            <div 
              key={idx} 
              className="medicine-card" 
              onClick={() => setSelectedMedicine(medicine)}
            >
              <div className="medicine-image">
                <img 
                  src={medicine.image} 
                  alt={medicine.name}
                />
              </div>
              <div className="medicine-content">
                <div className="medicine-icon">
                  <GiHerbsBundle />
                </div>
                <h3>{medicine.name}</h3>
                <span className="tag">{medicine.category}</span>
                <p>{medicine.overview}</p>
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {apiResult && apiResult.common && apiResult.common.length > 0 && (
        <section className="search-results">
          <h2>Search Results for "{searchQuery}"</h2>
          <div className="results-grid">
            {apiResult.common.map((item, idx) => (
              <div key={idx} className="result-card">
                <div className="card-icon"><FaLeaf /></div>
                <h3>{item.food_name}</h3>
                <div className="details">
                  <p><strong>Category:</strong> {item.food_group}</p>
                  <p><strong>Serving:</strong> {item.serving_unit}</p>
                </div>
                <a 
                  href={`https://www.ncbi.nlm.nih.gov/pmc/?term=${encodeURIComponent(item.food_name)}+ayurvedic`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-details-btn"
                >
                  View Research
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Ayurvedic; 