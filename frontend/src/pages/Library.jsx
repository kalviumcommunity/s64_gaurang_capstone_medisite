import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { FaSearch, FaPills, FaLeaf, FaExclamationTriangle, FaCheckCircle, FaLightbulb } from 'react-icons/fa';
import { getMedicineInformation } from '../services/deepSeekService';
import './Library.css';

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicineType, setMedicineType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [medicineData, setMedicineData] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [aiInsights, setAiInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Extended medicine data
  const medicines = {
    allopathic: [
      {
        name: "Paracetamol",
        description: "Pain reliever and fever reducer",
        type: "Pain Relievers",
        uses: ["Fever", "Headache", "Body pain", "Toothache", "Menstrual cramps"],
        sideEffects: ["Nausea", "Liver problems in high doses", "Skin rash", "Loss of appetite"],
        dosage: "500-1000mg every 4-6 hours, maximum 4000mg per day",
        precautions: ["Avoid alcohol", "Do not exceed recommended dose", "Consult doctor if symptoms persist"]
      },
      {
        name: "Ibuprofen",
        description: "Non-steroidal anti-inflammatory drug",
        type: "Pain Relievers",
        uses: ["Pain", "Inflammation", "Fever", "Arthritis", "Joint pain"],
        sideEffects: ["Stomach upset", "Heartburn", "Dizziness", "High blood pressure"],
        dosage: "200-400mg every 4-6 hours",
        precautions: ["Take with food", "Avoid if stomach ulcers", "Not for long-term use without supervision"]
      },
      {
        name: "Amoxicillin",
        description: "Broad-spectrum antibiotic",
        type: "Antibiotics",
        uses: ["Bacterial infections", "Chest infections", "Ear infections", "Dental infections"],
        sideEffects: ["Diarrhea", "Nausea", "Rash", "Allergic reactions"],
        dosage: "250-500mg three times daily",
        precautions: ["Complete full course", "Take at regular intervals", "Report allergic reactions immediately"]
      }
    ],
    ayurvedic: [
      {
        name: "Triphala",
        description: "Traditional digestive and detoxification formula",
        type: "Digestive Health",
        uses: ["Digestion", "Detoxification", "Immunity", "Eye health", "Skin health"],
        sideEffects: ["Mild laxative effect", "Temporary digestive changes"],
        dosage: "500-1000mg before bed",
        precautions: ["Start with lower dose", "Take on empty stomach", "Not for pregnant women"]
      },
      {
        name: "Ashwagandha",
        description: "Adaptogenic herb for stress relief and vitality",
        type: "Stress Relief",
        uses: ["Stress", "Anxiety", "Sleep", "Energy", "Immunity"],
        sideEffects: ["Drowsiness in high doses", "Mild digestive upset"],
        dosage: "300-500mg twice daily",
        precautions: ["Avoid during pregnancy", "May interact with sedatives", "Consult practitioner if on medication"]
      },
      {
        name: "Brahmi",
        description: "Memory and cognitive enhancement herb",
        type: "Brain Health",
        uses: ["Memory enhancement", "Concentration", "Mental clarity", "Anxiety", "Brain function"],
        sideEffects: ["Mild digestive issues", "Headache initially"],
        dosage: "250-500mg twice daily",
        precautions: ["Start with lower dose", "Not for pregnant women", "May affect thyroid function"]
      }
    ]
  };

  const handleTypeSelect = (type) => {
    setMedicineType(type);
    setShowSearch(true);
    setMedicineData(null);
    setError(null);
    setSearchQuery('');
    setAiInsights('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAiInsights('');

    const searchTerm = searchQuery.toLowerCase().trim();
    if (!searchTerm) {
      setError('Please enter a medicine name');
      setLoading(false);
      return;
    }

    const results = medicines[medicineType].filter(med => 
      med.name.toLowerCase().includes(searchTerm) ||
      med.type.toLowerCase().includes(searchTerm)
    );

    if (results.length > 0) {
      setMedicineData(results[0]);
      
      // Get AI insights for the selected medicine
      try {
        setLoadingInsights(true);
        const insights = await getMedicineInformation(results[0].name);
        setAiInsights(insights);
      } catch (error) {
        console.error('Error getting AI insights for medicine:', error);
      } finally {
        setLoadingInsights(false);
      }
    } else {
      setError('No medicine found matching your search');
    }
    setLoading(false);
  };

  if (!showSearch) {
    return (
      <div className="library-page">
        <Navigation />
        <div className="library-content">
          <h1>Choose Your Healing Pathway</h1>
          <div className="healing-paths">
            <div className="healing-path ayurvedic" onClick={() => handleTypeSelect('ayurvedic')}>
              <div className="path-icon">
                <FaLeaf />
              </div>
              <h2>Ayurvedic Medicine</h2>
              <p>Traditional healing system with roots in ancient India</p>
              <ul>
                <li><FaCheckCircle /> Holistic healing approach</li>
                <li><FaCheckCircle /> Natural herbal treatments</li>
                <li><FaCheckCircle /> Balance of mind, body, and spirit</li>
                <li><FaCheckCircle /> Personalized wellness plans</li>
              </ul>
              <button className="explore-btn">Explore Ayurvedic Remedies</button>
            </div>

            <div className="healing-path allopathic" onClick={() => handleTypeSelect('allopathic')}>
              <div className="path-icon">
                <FaPills />
              </div>
              <h2>Allopathic Medicine</h2>
              <p>Modern conventional medical treatment system</p>
              <ul>
                <li><FaCheckCircle /> Evidence-based treatments</li>
                <li><FaCheckCircle /> Pharmaceutical medications</li>
                <li><FaCheckCircle /> Advanced diagnostic tools</li>
                <li><FaCheckCircle /> Surgical interventions</li>
              </ul>
              <button className="explore-btn">Explore Allopathic Treatments</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="library-page">
      <Navigation />
      <div className="library-content">
        <h1>Medicine Library</h1>
        <p className="library-description">
          Search and learn about {medicineType === 'allopathic' ? 'Allopathic' : 'Ayurvedic'} medicines
        </p>

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-bar">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={`Search ${medicineType} medicines...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>

        <button 
          className="back-button"
          onClick={() => setShowSearch(false)}
        >
          ← Back to Healing Pathways
        </button>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Searching for medicines...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <FaExclamationTriangle />
            <p className="error-message">{error}</p>
          </div>
        )}

        {medicineData && (
          <div className="medicine-card">
            <h2>{medicineData.name}</h2>
            <p className="medicine-type">{medicineData.type}</p>
            <p className="medicine-description">{medicineData.description}</p>
            
            <div className="medicine-details">
              <div className="detail-section">
                <h3>Uses</h3>
                <ul>
                  {medicineData.uses.map((use, index) => (
                    <li key={index}><FaCheckCircle /> {use}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h3>Side Effects</h3>
                <ul className="side-effects">
                  {medicineData.sideEffects.map((effect, index) => (
                    <li key={index}><FaExclamationTriangle /> {effect}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h3>Dosage</h3>
                <p>{medicineData.dosage}</p>
              </div>

              <div className="detail-section">
                <h3>Precautions</h3>
                <ul className="precautions">
                  {medicineData.precautions.map((precaution, index) => (
                    <li key={index}><FaExclamationTriangle /> {precaution}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* DeepSeek AI Insights */}
            <div className="ai-insights-section">
              <h3>
                <FaLightbulb className="insights-icon" />
                DeepSeek AI Insights
              </h3>
              {loadingInsights ? (
                <div className="loading-insights">
                  <div className="spinner"></div>
                  <p>Loading additional information...</p>
                </div>
              ) : (
                aiInsights ? (
                  <div className="insights-content">
                    {aiInsights}
                  </div>
                ) : (
                  <div className="no-insights">
                    <p>Additional AI-powered information is currently unavailable.</p>
                  </div>
                )
              )}
            </div>

            <div className="disclaimer">
              <FaExclamationTriangle />
              <p>This information is for educational purposes only. Always consult with a healthcare professional before taking any medication.</p>
            </div>
          </div>
        )}

        <div className="sample-searches">
          <p>Popular searches in {medicineType === 'allopathic' ? 'Allopathic' : 'Ayurvedic'} medicine:</p>
          <div className="sample-tags">
            {medicines[medicineType].map(med => (
              <button 
                key={med.name}
                onClick={() => {
                  setSearchQuery(med.name);
                  setMedicineData(med);
                  // Get AI insights for the selected medicine
                  setLoadingInsights(true);
                  setAiInsights('');
                  getMedicineInformation(med.name)
                    .then(insights => setAiInsights(insights))
                    .catch(error => console.error('Error getting AI insights:', error))
                    .finally(() => setLoadingInsights(false));
                }}
                className="sample-tag"
              >
                {med.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library; 