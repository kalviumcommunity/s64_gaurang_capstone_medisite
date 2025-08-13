import React, { useState } from 'react';
import { FaSearch, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { GiMedicinePills } from 'react-icons/gi';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import './Allopathic.css';

const Allopathic = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Common Allopathic categories
  const categories = ['All', 'Antibiotics', 'Painkillers', 'Antivirals', 'Cardiovascular', 'Respiratory'];

  // Curated list of common Allopathic medicines
  const commonMedicines = [
    {
      name: 'Amoxicillin',
      category: 'Antibiotics',
      type: 'Penicillin Antibiotic',
      medicineType: 'Allopathic',
      image: '/medicines/amoxicillin.jpg',
      backgroundImage: '/medicines/amoxicillin-bg.jpg',
      overview: 'Amoxicillin is a penicillin antibiotic used to treat various bacterial infections.',
      benefits: [
        'Treats bacterial infections',
        'Effective against many types of bacteria',
        'Well-tolerated by most patients',
        'Available in multiple forms'
      ],
      usageInstructions: 'Take as prescribed by your doctor. Typically 250-500mg every 8 hours with or without food.',
      precautions: [
        'Take full course as prescribed',
        'Not effective against viral infections',
        'May cause allergic reactions',
        'Inform doctor about any allergies'
      ],
      dosageForm: 'Capsule/Tablet/Suspension',
      commonBrands: ['Amoxil', 'Trimox', 'Moxatag']
    },
    {
      name: 'Ibuprofen',
      category: 'Painkillers',
      type: 'NSAID',
      medicineType: 'Allopathic',
      image: '/medicines/ibuprofen.jpg',
      backgroundImage: '/medicines/ibuprofen-bg.jpg',
      overview: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation.',
      benefits: [
        'Reduces pain and inflammation',
        'Helps lower fever',
        'Works quickly when taken as directed',
        'Available over-the-counter'
      ],
      usageInstructions: 'Adults and children 12 years and older: 200-400mg every 4-6 hours as needed. Do not exceed 1200mg in 24 hours.',
      precautions: [
        'Take with food to prevent stomach upset',
        'Not recommended for long-term use',
        'May increase risk of heart attack or stroke',
        'Avoid if allergic to NSAIDs'
      ],
      dosageForm: 'Tablet/Capsule/Liquid',
      commonBrands: ['Advil', 'Motrin', 'Brufen']
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
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
                  <GiMedicinePills className="usage-icon" />
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
                <GiMedicinePills className="card-icon" />
                <h3>Dosage Form</h3>
                <p>{selectedMedicine.dosageForm}</p>
              </div>

              <div className="info-card category">
                <FaInfoCircle className="card-icon" />
                <h3>Category</h3>
                <p>{selectedMedicine.category}</p>
              </div>

              <div className="disclaimer">
                <BiErrorCircle className="disclaimer-icon" />
                <p>Information provided is for educational purposes only. Always consult with a healthcare professional before starting any medication.</p>
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
        <p>Explore modern medicine and pharmaceutical treatments</p>
      </header>

      <section className="search-section">
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-bar">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for Allopathic medicines..."
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

      <section className="medicines-section">
        <h2>Common Allopathic Medicines</h2>
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
                  <GiMedicinePills />
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
    </div>
  );
};

export default Allopathic; 