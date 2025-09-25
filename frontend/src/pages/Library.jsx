import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { 
  FaSearch, FaPills, FaLeaf, FaExclamationTriangle, FaCheckCircle, FaLightbulb,
  FaHeart, FaBrain, FaShieldAlt, FaClock, FaUsers, FaBookOpen, FaMicroscope,
  FaStethoscope, FaFlask, FaSeedling, FaBalanceScale, FaStar, FaArrowRight,
  FaInfoCircle, FaHistory, FaGlobe, FaAward, FaHandsHelping
} from 'react-icons/fa';
import { getMedicineInformation } from '../services/deepSeekService';
import './Library.css';

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicineType, setMedicineType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [medicineData, setMedicineData] = useState(null);
  const [resultsList, setResultsList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [aiInsights, setAiInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const location = useLocation();

  // Extended medicine data
  const medicines = {
    allopathic: [
      {
        name: "Paracetamol",
        description: "Pain reliever and fever reducer",
        type: "Pain Relievers",
        uses: ["Fever", "Headache", "Body pain", "Toothache", "Menstrual cramps"],
        indications: ["Mild to moderate pain", "Pyrexia"],
        mechanism: "Inhibits prostaglandin synthesis in the CNS producing analgesic and antipyretic effects.",
        sideEffects: ["Nausea", "Liver problems in high doses", "Skin rash", "Loss of appetite"],
        dosage: "500–1000 mg every 4–6 hours as needed; max 4000 mg/day (lower in liver disease).",
        contraindications: ["Severe hepatic impairment", "Hypersensitivity"],
        interactions: ["Alcohol (↑ hepatotoxicity)", "Warfarin (↑ INR with chronic use)", "Enzyme-inducing antiepileptics"],
        availableForms: ["Tablet", "Syrup", "Suppository"],
        brands: ["Crocin", "Tylenol", "Calpol"],
        onset: "30–60 min",
        duration: "3–6 hours",
        pregnancyUse: "Generally considered safe at recommended doses",
        lactationUse: "Compatible with breastfeeding",
        storage: "Store below 25°C; protect from moisture",
        overdose: "May cause hepatic failure; seek emergency care immediately",
        precautions: ["Avoid alcohol", "Do not exceed recommended dose", "Consult doctor if symptoms persist"]
      },
      {
        name: "Ibuprofen",
        description: "Non-steroidal anti-inflammatory drug",
        type: "Pain Relievers",
        uses: ["Pain", "Inflammation", "Fever", "Arthritis", "Joint pain"],
        indications: ["Musculoskeletal pain", "Dysmenorrhea", "Dental pain"],
        mechanism: "Non-selective COX inhibition → reduced prostaglandins (analgesic, antipyretic, anti-inflammatory).",
        sideEffects: ["Stomach upset", "Heartburn", "Dizziness", "High blood pressure"],
        dosage: "200–400 mg every 4–6 hours (max 1200 mg/day OTC)",
        contraindications: ["Active GI ulcer/bleed", "Severe heart failure", "Late pregnancy (3rd trimester)", "NSAID allergy"],
        interactions: ["Anticoagulants (↑ bleed risk)", "ACE inhibitors/Diuretics (↓ renal function)", "Aspirin"],
        availableForms: ["Tablet", "Suspension", "Gel"],
        brands: ["Brufen", "Advil", "Motrin"],
        onset: "30–60 min",
        duration: "6–8 hours",
        pregnancyUse: "Avoid in 3rd trimester; use only if benefits outweigh risks earlier",
        lactationUse: "Compatible with breastfeeding",
        storage: "Store below 25°C",
        overdose: "May cause GI bleed/renal issues; seek care",
        precautions: ["Take with food", "Avoid if stomach ulcers", "Not for long-term use without supervision"]
      },
      {
        name: "Amoxicillin",
        description: "Broad-spectrum antibiotic",
        type: "Antibiotics",
        uses: ["Bacterial infections", "Chest infections", "Ear infections", "Dental infections"],
        indications: ["Susceptible bacterial infections"],
        mechanism: "Beta‑lactam antibiotic; inhibits bacterial cell wall synthesis.",
        sideEffects: ["Diarrhea", "Nausea", "Rash", "Allergic reactions"],
        dosage: "250–500 mg three times daily (as prescribed)",
        contraindications: ["Penicillin allergy"],
        interactions: ["Warfarin (↑ INR)", "Allopurinol (↑ rash risk)", "Oral contraceptives (↓ efficacy)"] ,
        availableForms: ["Capsule", "Suspension"],
        brands: ["Amoxil", "Mox", "Trimox"],
        onset: "Variable (hours)",
        duration: "Dose-dependent",
        pregnancyUse: "Generally considered safe (Category B)",
        lactationUse: "Low levels in milk; generally safe",
        storage: "Suspension refrigerate as labeled; discard after course",
        overdose: "GI upset, imbalance—seek care",
        precautions: ["Complete full course", "Take at regular intervals", "Report allergic reactions immediately"]
      }
    ],
    ayurvedic: [
      {
        name: "Triphala",
        description: "Traditional digestive and detoxification formula",
        type: "Digestive Health",
        uses: ["Digestion", "Detoxification", "Immunity", "Eye health", "Skin health"],
        indications: ["Constipation", "Digestive sluggishness"],
        mechanism: "Blend of three fruits (Amalaki, Bibhitaki, Haritaki) supporting digestion and antioxidant defense.",
        sideEffects: ["Mild laxative effect", "Temporary digestive changes"],
        dosage: "500–1000 mg at bedtime or as advised by practitioner",
        contraindications: ["Pregnancy", "Severe diarrhea"],
        interactions: ["May potentiate laxatives", "Caution with anticoagulants"],
        availableForms: ["Powder (churna)", "Tablet"],
        brands: ["Himalaya", "Dabur", "Baidyanath"],
        onset: "Few days of consistent use",
        duration: "Sustained with continued use",
        pregnancyUse: "Avoid unless advised",
        lactationUse: "Consult practitioner",
        storage: "Keep in a cool, dry place",
        overdose: "May lead to diarrhea/dehydration",
        precautions: ["Start with lower dose", "Take on empty stomach", "Not for pregnant women"]
      },
      {
        name: "Ashwagandha",
        description: "Adaptogenic herb for stress relief and vitality",
        type: "Stress Relief",
        uses: ["Stress", "Anxiety", "Sleep", "Energy", "Immunity"],
        indications: ["Stress-related fatigue", "Sleep disturbance"],
        mechanism: "Withanolides support HPA-axis balance and resilience to stress.",
        sideEffects: ["Drowsiness in high doses", "Mild digestive upset"],
        dosage: "300–500 mg extract twice daily (standardized)",
        contraindications: ["Pregnancy", "Hyperthyroidism (caution)"],
        interactions: ["Sedatives (additive)", "Thyroid medication (monitor)"],
        availableForms: ["Capsule", "Powder", "Liquid extract"],
        brands: ["Himalaya", "Organic India", "KSM‑66"],
        onset: "1–2 weeks",
        duration: "Improves with regular use",
        pregnancyUse: "Avoid",
        lactationUse: "Consult practitioner",
        storage: "Keep in a cool, dry place",
        overdose: "May cause GI upset, sedation",
        precautions: ["Avoid during pregnancy", "May interact with sedatives", "Consult practitioner if on medication"]
      },
      {
        name: "Brahmi",
        description: "Memory and cognitive enhancement herb",
        type: "Brain Health",
        uses: ["Memory enhancement", "Concentration", "Mental clarity", "Anxiety", "Brain function"],
        indications: ["Mild cognitive complaints", "Anxiety"],
        mechanism: "Bacosides may enhance synaptic communication and have antioxidant effects.",
        sideEffects: ["Mild digestive issues", "Headache initially"],
        dosage: "250–500 mg extract twice daily",
        contraindications: ["Pregnancy", "Bradycardia (caution)"] ,
        interactions: ["Sedatives (additive)", "Thyroid medications (monitor)"],
        availableForms: ["Capsule", "Syrup"],
        brands: ["Himalaya", "Baidyanath"],
        onset: "2–4 weeks",
        duration: "Improves with regular use",
        pregnancyUse: "Avoid",
        lactationUse: "Consult practitioner",
        storage: "Store in a cool, dry place",
        overdose: "May cause nausea, cramps",
        precautions: ["Start with lower dose", "Not for pregnant women", "May affect thyroid function"]
      }
    ]
  };

  // Initialize from URL query param (?type=allopathic|ayurvedic)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'allopathic' || type === 'ayurvedic') {
      setMedicineType(type);
      setShowSearch(true);
    }
  }, [location.search]);

  // Build a flat list of searchable tokens for suggestions
  const searchableItems = useMemo(() => {
    if (!medicineType) return [];
    return medicines[medicineType].map(m => ({
      name: m.name,
      type: m.type,
      description: m.description,
      uses: (m.uses || []).join(' '),
      indications: (m.indications || []).join(' '),
      brands: (m.brands || []).join(' ')
    }));
  }, [medicineType]);

  const updateSuggestions = (value) => {
    const term = value.toLowerCase().trim();
    if (!term) {
      setSuggestions([]);
      return;
    }
    const matches = searchableItems
      .filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.uses.toLowerCase().includes(term) ||
        item.indications.toLowerCase().includes(term) ||
        item.brands.toLowerCase().includes(term)
      )
      .slice(0, 6);
    setSuggestions(matches);
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
      setResultsList(results);
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
      setResultsList([]);
      setError('No medicine found matching your search');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    updateSuggestions(value);
  };

  const handleSelectSuggestion = (name) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    setTimeout(() => {
      // programmatically submit
      const fakeEvent = { preventDefault: () => {} };
      handleSearch(fakeEvent);
    }, 0);
  };

  if (!showSearch) {
    return (
      <div className="library-page">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pathway-hero">
          <div className="hero-background">
            <div className="hero-overlay"></div>
            <div className="hero-pattern"></div>
          </div>
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <FaHeart className="badge-icon" />
                <span>Trusted Health Platform</span>
              </div>
              <h1 className="hero-title">
                Choose Your <span className="gradient-text">Healing Pathway</span>
              </h1>
              <p className="hero-subtitle">
                Discover the perfect approach to your health and wellness journey. 
                Explore both traditional wisdom and modern medicine to find what works best for you.
              </p>
              <div className="hero-features">
                <div className="feature-item">
                  <FaShieldAlt className="feature-icon" />
                  <span>Evidence-Based</span>
                </div>
                <div className="feature-item">
                  <FaUsers className="feature-icon" />
                  <span>Expert Guidance</span>
                </div>
                <div className="feature-item">
                  <FaGlobe className="feature-icon" />
                  <span>Global Access</span>
                </div>
              </div>
              <div className="hero-cta">
                <button className="cta-primary">
                  Start Your Journey
                  <FaArrowRight />
                </button>
                <button className="cta-secondary">
                  Learn More
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-cards">
                <div className="hero-card ayurvedic-card">
                  <div className="card-icon">
                    <FaSeedling />
                  </div>
                  <h3>Ayurvedic</h3>
                  <p>Traditional healing</p>
                  <div className="card-stats">
                    <span className="stat">5000+ years</span>
                    <span className="stat">300+ herbs</span>
                  </div>
                </div>
                <div className="hero-card allopathic-card">
                  <div className="card-icon">
                    <FaStethoscope />
                  </div>
                  <h3>Allopathic</h3>
                  <p>Modern medicine</p>
                  <div className="card-stats">
                    <span className="stat">1000+ medicines</span>
                    <span className="stat">99% accuracy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-icon-wrapper">
                  <FaUsers className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-number">50,000+</span>
                  <span className="stat-label">Users Helped</span>
                  <span className="stat-description">Worldwide</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrapper">
                  <FaBookOpen className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Medicines</span>
                  <span className="stat-description">In Database</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrapper">
                  <FaStar className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-number">4.9</span>
                  <span className="stat-label">Rating</span>
                  <span className="stat-description">User Satisfaction</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrapper">
                  <FaAward className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                  <span className="stat-description">Always Available</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="comparison-section">
          <div className="comparison-container">
            <h2>Understanding Both Approaches</h2>
            <div className="comparison-grid">
              <div className="comparison-card">
                <h3>Key Differences</h3>
                <div className="comparison-item">
                  <div className="comparison-label">
                    <FaClock className="comparison-icon" />
                    <span>Treatment Duration</span>
                  </div>
                  <div className="comparison-values">
                    <div className="value ayurvedic">Long-term, gradual healing</div>
                    <div className="value allopathic">Quick, targeted relief</div>
                  </div>
                </div>
                <div className="comparison-item">
                  <div className="comparison-label">
                    <FaFlask className="comparison-icon" />
                    <span>Treatment Method</span>
                  </div>
                  <div className="comparison-values">
                    <div className="value ayurvedic">Natural herbs & lifestyle</div>
                    <div className="value allopathic">Synthetic medications</div>
                  </div>
                </div>
                <div className="comparison-item">
                  <div className="comparison-label">
                    <FaMicroscope className="comparison-icon" />
                    <span>Scientific Basis</span>
                  </div>
                  <div className="comparison-values">
                    <div className="value ayurvedic">Traditional knowledge</div>
                    <div className="value allopathic">Clinical trials</div>
                  </div>
                </div>
              </div>
              
              <div className="comparison-card">
                <h3>When to Choose</h3>
                <div className="when-to-choose">
                  <div className="choose-ayurvedic">
                    <h4><FaSeedling className="choose-icon" /> Ayurvedic Medicine</h4>
                    <ul>
                      <li>Chronic conditions</li>
                      <li>Preventive care</li>
                      <li>Stress management</li>
                      <li>Digestive issues</li>
                      <li>Mental wellness</li>
                    </ul>
                  </div>
                  <div className="choose-allopathic">
                    <h4><FaStethoscope className="choose-icon" /> Allopathic Medicine</h4>
                    <ul>
                      <li>Acute conditions</li>
                      <li>Emergency care</li>
                      <li>Infections</li>
                      <li>Surgical needs</li>
                      <li>Life-threatening diseases</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Healing Pathways */}
        <section className="healing-pathways">
          <div className="pathways-container">
            <div className="pathway-card ayurvedic" onClick={() => handleTypeSelect('ayurvedic')}>
              <div className="pathway-header">
                <div className="pathway-icon">
                  <FaSeedling />
                </div>
                <div className="pathway-badge">Traditional</div>
              </div>
              <div className="pathway-content">
                <h2>Ayurvedic Medicine</h2>
                <p className="pathway-description">
                  A 5,000-year-old holistic healing system from India that focuses on balancing 
                  mind, body, and spirit through natural remedies and lifestyle modifications.
                </p>
                
                <div className="pathway-features">
                  <div className="feature-item">
                    <FaHeart className="feature-icon" />
                    <div className="feature-content">
                      <h4>Holistic Approach</h4>
                      <p>Treats the whole person, not just symptoms</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <FaLeaf className="feature-icon" />
                    <div className="feature-content">
                      <h4>Natural Remedies</h4>
                      <p>Uses herbs, minerals, and natural substances</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <FaBalanceScale className="feature-icon" />
                    <div className="feature-content">
                      <h4>Dosha Balance</h4>
                      <p>Personalized treatment based on body constitution</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <FaClock className="feature-icon" />
                    <div className="feature-content">
                      <h4>Preventive Care</h4>
                      <p>Focuses on maintaining health and preventing disease</p>
                    </div>
                  </div>
                </div>

                <div className="pathway-benefits">
                  <h4>Key Benefits:</h4>
                  <ul>
                    <li><FaCheckCircle /> Gentle on the body</li>
                    <li><FaCheckCircle /> Fewer side effects</li>
                    <li><FaCheckCircle /> Addresses root causes</li>
                    <li><FaCheckCircle /> Promotes overall wellness</li>
                    <li><FaCheckCircle /> Sustainable approach</li>
                  </ul>
                </div>

                <div className="pathway-stats">
                  <div className="stat">
                    <span className="stat-number">5000+</span>
                    <span className="stat-label">Years of History</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">300+</span>
                    <span className="stat-label">Herbs Used</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">3</span>
                    <span className="stat-label">Doshas</span>
                  </div>
                </div>

                <button className="explore-btn">
                  Explore Ayurvedic Medicine
                  <FaArrowRight />
                </button>
              </div>
            </div>

            <div className="pathway-card allopathic" onClick={() => handleTypeSelect('allopathic')}>
              <div className="pathway-header">
                <div className="pathway-icon">
                  <FaStethoscope />
                </div>
                <div className="pathway-badge">Modern</div>
              </div>
              <div className="pathway-content">
                <h2>Allopathic Medicine</h2>
                <p className="pathway-description">
                  Modern Western medicine that uses evidence-based treatments, 
                  pharmaceutical drugs, and advanced medical technology to diagnose and treat diseases.
                </p>
                
                <div className="pathway-features">
                  <div className="feature-item">
                    <FaMicroscope className="feature-icon" />
                    <div className="feature-content">
                      <h4>Evidence-Based</h4>
                      <p>Treatments backed by scientific research</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <FaPills className="feature-icon" />
                    <div className="feature-content">
                      <h4>Pharmaceuticals</h4>
                      <p>Precise, standardized medications</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <FaShieldAlt className="feature-icon" />
                    <div className="feature-content">
                      <h4>Advanced Diagnostics</h4>
                      <p>State-of-the-art medical imaging and tests</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <FaHandsHelping className="feature-icon" />
                    <div className="feature-content">
                      <h4>Surgical Interventions</h4>
                      <p>Advanced surgical procedures and techniques</p>
                    </div>
                  </div>
                </div>

                <div className="pathway-benefits">
                  <h4>Key Benefits:</h4>
                  <ul>
                    <li><FaCheckCircle /> Fast-acting treatments</li>
                    <li><FaCheckCircle /> Precise diagnosis</li>
                    <li><FaCheckCircle /> Emergency care</li>
                    <li><FaCheckCircle /> Life-saving interventions</li>
                    <li><FaCheckCircle /> Regulated standards</li>
                  </ul>
                </div>

                <div className="pathway-stats">
                  <div className="stat">
                    <span className="stat-number">200+</span>
                    <span className="stat-label">Years of Development</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">1000+</span>
                    <span className="stat-label">Medicines Available</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">99%</span>
                    <span className="stat-label">Accuracy Rate</span>
                  </div>
                </div>

                <button className="explore-btn">
                  Explore Allopathic Medicine
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Educational Resources */}
        <section className="educational-resources">
          <div className="resources-container">
            <h2>Learn More About Health & Medicine</h2>
            <div className="resources-grid">
              <div className="resource-card">
                <FaHistory className="resource-icon" />
                <h3>History of Medicine</h3>
                <p>Explore the evolution of medical practices from ancient times to modern day</p>
                <button className="resource-btn">Learn More</button>
              </div>
              <div className="resource-card">
                <FaGlobe className="resource-icon" />
                <h3>Global Health</h3>
                <p>Understand how different cultures approach health and healing</p>
                <button className="resource-btn">Learn More</button>
              </div>
              <div className="resource-card">
                <FaAward className="resource-icon" />
                <h3>Best Practices</h3>
                <p>Discover evidence-based health practices and recommendations</p>
                <button className="resource-btn">Learn More</button>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="disclaimer-section">
          <div className="disclaimer-container">
            <FaInfoCircle className="disclaimer-icon" />
            <div className="disclaimer-content">
              <h3>Important Disclaimer</h3>
              <p>
                The information provided is for educational purposes only and should not replace 
                professional medical advice. Always consult with qualified healthcare providers 
                before making decisions about your health and treatment options.
              </p>
            </div>
          </div>
        </section>
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
          <form onSubmit={handleSearch} className="search-bar enhanced">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={`Search ${medicineType} medicines...`}
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => updateSuggestions(searchQuery)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-input"
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((s) => (
                    <button
                      type="button"
                      key={s.name}
                      className="suggestion-item"
                      onClick={() => handleSelectSuggestion(s.name)}
                    >
                      <span className="suggestion-name">{s.name}</span>
                      <span className="suggestion-type">{s.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="search-button primary">
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

        {resultsList && resultsList.length > 0 && (
          <div className="library-results-grid">
            {resultsList.map((med) => (
              <button
                key={med.name}
                className={`result-card ${medicineData && medicineData.name === med.name ? 'active' : ''}`}
                onClick={() => {
                  setMedicineData(med);
                  setAiInsights('');
                  setLoadingInsights(true);
                  getMedicineInformation(med.name)
                    .then((insights) => setAiInsights(insights))
                    .catch(() => {})
                    .finally(() => setLoadingInsights(false));
                }}
              >
                <div className="result-card-title">{med.name}</div>
                <div className="result-card-type">{med.type}</div>
                <div className="result-card-desc">{med.description}</div>
              </button>
            ))}
          </div>
        )}

        {medicineData && (
          <div className="medicine-card">
            <div className="medicine-header">
              <h2>{medicineData.name}</h2>
              <span className="medicine-type chip">{medicineData.type}</span>
            </div>
            <p className="medicine-description">{medicineData.description}</p>
            
            <div className="medicine-details">
              <div className="detail-section uses-section">
                <h3>Uses</h3>
                <ul>
                  {medicineData.uses.map((use, index) => (
                    <li key={index}><FaCheckCircle /> {use}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section side-effects-section">
                <h3>Side Effects</h3>
                <ul className="side-effects">
                  {medicineData.sideEffects.map((effect, index) => (
                    <li key={index}><FaExclamationTriangle /> {effect}</li>
                  ))}
                </ul>
                </div>

              <div className="detail-section dosage-section">
                <h3>Dosage</h3>
                <p>{medicineData.dosage}</p>
              </div>

              {medicineData.indications && (
                <div className="detail-section">
                  <h3>Indications</h3>
                  <ul>
                    {medicineData.indications.map((i, idx) => (
                      <li key={idx}><FaCheckCircle /> {i}</li>
                    ))}
                  </ul>
                </div>
              )}

              {medicineData.mechanism && (
                <div className="detail-section">
                  <h3>How it works</h3>
                  <p>{medicineData.mechanism}</p>
                </div>
              )}

              {medicineData.contraindications && (
                <div className="detail-section">
                  <h3>Contraindications</h3>
                  <ul>
                    {medicineData.contraindications.map((c, idx) => (
                      <li key={idx}><FaExclamationTriangle /> {c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {medicineData.interactions && (
                <div className="detail-section">
                  <h3>Drug/Herb Interactions</h3>
                  <ul>
                    {medicineData.interactions.map((c, idx) => (
                      <li key={idx}><FaExclamationTriangle /> {c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(medicineData.availableForms || medicineData.brands) && (
                <div className="detail-section">
                  <h3>Forms & Brands</h3>
                  {medicineData.availableForms && (
                    <p><strong>Forms:</strong> {medicineData.availableForms.join(', ')}</p>
                  )}
                  {medicineData.brands && (
                    <p><strong>Brands:</strong> {medicineData.brands.join(', ')}</p>
                  )}
                </div>
              )}

              {(medicineData.onset || medicineData.duration) && (
                <div className="detail-section">
                  <h3>Onset & Duration</h3>
                  <p>
                    {medicineData.onset && (<><strong>Onset:</strong> {medicineData.onset} </>)}
                    {medicineData.duration && (<><strong> | Duration:</strong> {medicineData.duration}</>)}
                  </p>
                </div>
              )}

              {(medicineData.pregnancyUse || medicineData.lactationUse) && (
                <div className="detail-section">
                  <h3>Special Populations</h3>
                  {medicineData.pregnancyUse && (
                    <p><strong>Pregnancy:</strong> {medicineData.pregnancyUse}</p>
                  )}
                  {medicineData.lactationUse && (
                    <p><strong>Lactation:</strong> {medicineData.lactationUse}</p>
                  )}
                </div>
              )}

              {(medicineData.storage || medicineData.overdose) && (
                <div className="detail-section">
                  <h3>Storage & Overdose</h3>
                  {medicineData.storage && (
                    <p><strong>Storage:</strong> {medicineData.storage}</p>
                  )}
                  {medicineData.overdose && (
                    <p><strong>Overdose:</strong> {medicineData.overdose}</p>
                  )}
                </div>
              )}

              <div className="detail-section precautions-section">
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