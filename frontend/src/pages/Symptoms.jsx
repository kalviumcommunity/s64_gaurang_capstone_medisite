import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaThermometerHalf, FaPills, FaHome, FaBook, FaRobot, FaUser, FaLightbulb } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import { getHealthInformation } from '../services/deepSeekService';
import './Symptoms.css';

const Symptoms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [aiInsights, setAiInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const inputRef = useRef(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [selectedItems, setSelectedItems] = useState([]); // {id, name, severity, duration}

  // Common symptoms database
  const commonSymptoms = [
    {
      id: 1,
      name: 'Fever',
      description: 'An elevated body temperature that\'s usually a sign the body is fighting an infection.',
      possibleCauses: ['Viral Infection', 'Bacterial Infection', 'Inflammation', 'Heat Exposure', 'Autoimmune Conditions'],
      treatments: ['Rest', 'Hydration', 'Fever reducers', 'Cool environment', 'Light clothing'],
      urgencyLevel: 'Moderate',
      whenToSeekHelp: ['Temperature above 103°F (39.4°C)', 'Fever lasting more than 3 days', 'Severe headache', 'Difficulty breathing'],
      medicines: {
        allopathic: [
          {
            name: 'Acetaminophen',
            dosage: '500-1000mg every 4-6 hours',
            precautions: 'Do not exceed 4000mg in 24 hours'
          },
          {
            name: 'Ibuprofen',
            dosage: '200-400mg every 4-6 hours',
            precautions: 'Take with food'
          }
        ],
        ayurvedic: [
          {
            name: 'Tulsi',
            usage: 'Boil 10-15 leaves in water, drink as tea',
            benefits: 'Natural fever reducer, boosts immunity'
          },
          {
            name: 'Ginger-Turmeric Tea',
            usage: 'Mix 1tsp each in hot water',
            benefits: 'Anti-inflammatory, immune booster'
          }
        ]
      }
    },
    {
      id: 2,
      name: 'Headache',
      description: 'Pain or discomfort in the head, scalp, or neck.',
      possibleCauses: ['Stress', 'Dehydration', 'Eye strain', 'Tension', 'Migraine', 'Sinus pressure', 'High blood pressure'],
      treatments: ['Rest', 'Hydration', 'Pain relief', 'Dark quiet environment', 'Stress management', 'Regular exercise'],
      urgencyLevel: 'Low to Moderate',
      whenToSeekHelp: ['Sudden severe headache', 'Headache with fever and stiff neck', 'Vision changes', 'Confusion or weakness'],
      medicines: {
        allopathic: [
          {
            name: 'Ibuprofen',
            dosage: '200-400mg every 4-6 hours',
            precautions: 'Take with food'
          },
          {
            name: 'Aspirin',
            dosage: '325-650mg every 4-6 hours',
            precautions: 'Avoid on empty stomach'
          }
        ],
        ayurvedic: [
          {
            name: 'Brahmi',
            usage: '2-3 drops with warm water',
            benefits: 'Natural pain reliever, reduces stress'
          },
          {
            name: 'Peppermint Oil',
            usage: 'Apply diluted oil on temples',
            benefits: 'Cooling effect, pain relief'
          }
        ]
      }
    },
    {
      id: 3,
      name: 'Cough',
      description: 'A sudden, forceful expulsion of air from the lungs to clear the airways.',
      possibleCauses: ['Common cold', 'Flu', 'Allergies', 'Bronchitis', 'Asthma', 'GERD', 'COVID-19'],
      treatments: ['Stay hydrated', 'Humidifier use', 'Honey', 'Cough suppressants', 'Rest', 'Steam inhalation'],
      urgencyLevel: 'Low to High',
      whenToSeekHelp: ['Difficulty breathing', 'Coughing up blood', 'High fever', 'Chest pain', 'Wheezing'],
      medicines: {
        allopathic: [
          {
            name: 'Dextromethorphan',
            dosage: '10-20mg every 4 hours',
            precautions: 'Avoid alcohol, may cause drowsiness'
          },
          {
            name: 'Guaifenesin',
            dosage: '200-400mg every 4 hours',
            precautions: 'Stay hydrated'
          }
        ],
        ayurvedic: [
          {
            name: 'Sitopaladi Churna',
            usage: '1/4 to 1/2 tsp with honey',
            benefits: 'Relieves cough and cold symptoms'
          },
          {
            name: 'Talisadi Churna',
            usage: '1/2 tsp twice daily with honey',
            benefits: 'Respiratory health support'
          }
        ]
      }
    },
    {
      id: 4,
      name: 'Stomach Pain',
      description: 'Discomfort or pain in the abdomen region.',
      possibleCauses: ['Indigestion', 'Food poisoning', 'Gastritis', 'Ulcers', 'Appendicitis', 'IBS', 'Gallstones'],
      treatments: ['Dietary changes', 'Rest', 'Heat therapy', 'Hydration', 'Bland diet', 'Avoid trigger foods'],
      urgencyLevel: 'Low to High',
      whenToSeekHelp: ['Severe pain', 'Fever', 'Persistent vomiting', 'Blood in stool', 'Inability to keep food down'],
      medicines: {
        allopathic: [
          {
            name: 'Omeprazole',
            dosage: '20mg once daily',
            precautions: 'Take before meals'
          },
          {
            name: 'Simethicone',
            dosage: '125-250mg after meals',
            precautions: 'Safe for most people'
          }
        ],
        ayurvedic: [
          {
            name: 'Hingvastak Churna',
            usage: '1/4 to 1/2 tsp before meals',
            benefits: 'Improves digestion, reduces gas'
          },
          {
            name: 'Triphala',
            usage: '1/2 tsp at bedtime',
            benefits: 'Digestive health support'
          }
        ]
      }
    },
    {
      id: 5,
      name: 'Joint Pain',
      description: 'Pain, stiffness, or inflammation in joints affecting mobility.',
      possibleCauses: ['Arthritis', 'Injury', 'Overuse', 'Gout', 'Lupus', 'Fibromyalgia', 'Bursitis'],
      treatments: ['Physical therapy', 'Exercise', 'Hot/cold therapy', 'Weight management', 'Anti-inflammatory medications'],
      urgencyLevel: 'Low to Moderate',
      whenToSeekHelp: ['Severe swelling', 'Unable to bear weight', 'Joint deformity', 'Fever with joint pain'],
      medicines: {
        allopathic: [
          {
            name: 'Naproxen',
            dosage: '250-500mg twice daily',
            precautions: 'Take with food, avoid long-term use'
          },
          {
            name: 'Diclofenac',
            dosage: '50mg 2-3 times daily',
            precautions: 'Monitor blood pressure'
          }
        ],
        ayurvedic: [
          {
            name: 'Guggulu',
            usage: '500mg twice daily',
            benefits: 'Anti-inflammatory, joint health'
          },
          {
            name: 'Rasna',
            usage: 'As directed by practitioner',
            benefits: 'Pain relief, reduces inflammation'
          }
        ]
      }
    },
    {
      id: 6,
      name: 'Nausea',
      description: 'An uncomfortable feeling in the stomach with an urge to vomit.',
      possibleCauses: ['Food poisoning', 'Pregnancy', 'Motion sickness', 'Viral infections', 'Medication side effects', 'Migraine', 'Anxiety'],
      treatments: ['Hydration', 'Small frequent meals', 'Ginger', 'Avoiding triggers', 'Anti-nausea medication', 'Rest'],
      urgencyLevel: 'Low to Moderate',
      whenToSeekHelp: ['Unable to keep fluids down for 24+ hours', 'Signs of dehydration', 'Blood in vomit', 'Severe abdominal pain', 'Headache with confusion'],
      medicines: {
        allopathic: [
          {
            name: 'Ondansetron',
            dosage: '4-8mg every 8 hours as needed',
            precautions: 'May cause headache or constipation'
          },
          {
            name: 'Promethazine',
            dosage: '12.5-25mg every 4-6 hours',
            precautions: 'May cause drowsiness, avoid driving'
          }
        ],
        ayurvedic: [
          {
            name: 'Ginger',
            usage: 'Fresh ginger tea or 500mg capsules twice daily',
            benefits: 'Calms stomach, reduces nausea'
          },
          {
            name: 'Amla',
            usage: '1 tsp juice with honey',
            benefits: 'Settles stomach, improves digestion'
          }
        ]
      }
    },
    {
      id: 7,
      name: 'Weakness',
      description: 'Lack of physical or muscle strength, feeling tired or lethargic.',
      possibleCauses: ['Anemia', 'Dehydration', 'Poor nutrition', 'Infection', 'Sleep disorders', 'Diabetes', 'Thyroid problems', 'Chronic fatigue syndrome'],
      treatments: ['Rest', 'Balanced diet', 'Hydration', 'Iron supplements', 'B vitamins', 'Addressing underlying conditions', 'Regular exercise'],
      urgencyLevel: 'Low to High',
      whenToSeekHelp: ['Sudden weakness on one side of body', 'Difficulty speaking', 'Severe headache', 'Inability to walk', 'Weakness with fever lasting more than 3 days'],
      medicines: {
        allopathic: [
          {
            name: 'Iron supplements',
            dosage: '60-120mg elemental iron daily',
            precautions: 'Take on empty stomach, may cause constipation'
          },
          {
            name: 'B-Complex vitamins',
            dosage: 'As directed on package',
            precautions: 'Excessive B6 can cause nerve problems'
          }
        ],
        ayurvedic: [
          {
            name: 'Ashwagandha',
            usage: '300-500mg twice daily',
            benefits: 'Boosts energy, reduces fatigue'
          },
          {
            name: 'Chyawanprash',
            usage: '1 tsp daily with warm milk',
            benefits: 'Strengthens immunity, increases vitality'
          }
        ]
      }
    },
    {
      id: 8,
      name: 'High Blood Pressure',
      description: 'Blood pressure consistently higher than 130/80 mmHg, often without visible symptoms.',
      possibleCauses: ['Genetics', 'Age', 'Obesity', 'High sodium diet', 'Stress', 'Physical inactivity', 'Kidney disease', 'Sleep apnea'],
      treatments: ['Low sodium diet', 'Regular exercise', 'Weight management', 'Stress reduction', 'Medication', 'Limiting alcohol', 'Quitting smoking'],
      urgencyLevel: 'Moderate to High',
      whenToSeekHelp: ['Blood pressure above 180/120 mmHg', 'Severe headache', 'Vision problems', 'Shortness of breath', 'Chest pain', 'Blood in urine'],
      medicines: {
        allopathic: [
          {
            name: 'Lisinopril (ACE inhibitor)',
            dosage: '10-40mg once daily',
            precautions: 'May cause dry cough, monitor kidney function'
          },
          {
            name: 'Amlodipine (Calcium channel blocker)',
            dosage: '5-10mg once daily',
            precautions: 'May cause ankle swelling'
          }
        ],
        ayurvedic: [
          {
            name: 'Arjuna Bark',
            usage: '500mg twice daily',
            benefits: 'Strengthens heart, regulates blood pressure'
          },
          {
            name: 'Gokshura',
            usage: '300-500mg twice daily',
            benefits: 'Mild diuretic, supports heart health'
          }
        ]
      }
    },
    {
      id: 9,
      name: 'Low Blood Pressure',
      description: 'Blood pressure lower than 90/60 mmHg, causing lightheadedness and fatigue.',
      possibleCauses: ['Dehydration', 'Blood loss', 'Pregnancy', 'Heart problems', 'Endocrine disorders', 'Severe infection', 'Nutritional deficiencies', 'Medications'],
      treatments: ['Increased fluid intake', 'Salt in diet', 'Small frequent meals', 'Compression stockings', 'Medication adjustment', 'Treating underlying conditions'],
      urgencyLevel: 'Low to High',
      whenToSeekHelp: ['Fainting', 'Severe dizziness', 'Blurry vision', 'Confusion', 'Cold/clammy skin', 'Rapid/shallow breathing'],
      medicines: {
        allopathic: [
          {
            name: 'Fludrocortisone',
            dosage: '0.1-0.2mg daily',
            precautions: 'Monitor potassium levels, may cause swelling'
          },
          {
            name: 'Midodrine',
            dosage: '2.5-10mg three times daily',
            precautions: 'Don\'t take within 4 hours of bedtime'
          }
        ],
        ayurvedic: [
          {
            name: 'Licorice Root',
            usage: '300-400mg daily',
            benefits: 'Increases blood pressure, improves energy'
          },
          {
            name: 'Ashwagandha',
            usage: '500mg twice daily',
            benefits: 'Balances blood pressure, reduces fatigue'
          }
        ]
      }
    },
    {
      id: 10,
      name: 'Insomnia',
      description: 'Difficulty falling asleep, staying asleep, or poor quality sleep.',
      possibleCauses: ['Stress', 'Anxiety', 'Depression', 'Caffeine', 'Poor sleep habits', 'Medical conditions', 'Medications', 'Shift work'],
      treatments: ['Sleep hygiene', 'Consistent schedule', 'Relaxation techniques', 'Cognitive behavioral therapy', 'Limiting screen time', 'Comfortable sleep environment'],
      urgencyLevel: 'Low',
      whenToSeekHelp: ['Insomnia lasting more than 3 months', 'Affects daily functioning', 'Associated with mental health issues', 'Sleep apnea symptoms', 'Excessive daytime sleepiness'],
      medicines: {
        allopathic: [
          {
            name: 'Melatonin',
            dosage: '1-5mg 30 minutes before bedtime',
            precautions: 'Start with lowest effective dose, short-term use'
          },
          {
            name: 'Zolpidem (Ambien)',
            dosage: '5-10mg at bedtime',
            precautions: 'Short-term use only, risk of dependence'
          }
        ],
        ayurvedic: [
          {
            name: 'Ashwagandha',
            usage: '300-500mg before bed',
            benefits: 'Reduces stress, promotes relaxation'
          },
          {
            name: 'Brahmi',
            usage: '300mg before bedtime',
            benefits: 'Calms mind, reduces anxiety'
          }
        ]
      }
    },
    {
      id: 11,
      name: 'Skin Rash',
      description: 'Inflamed, irritated, or discolored areas of skin often with itching or pain.',
      possibleCauses: ['Allergic reaction', 'Infections', 'Heat', 'Medications', 'Autoimmune disorders', 'Contact with irritants', 'Stress'],
      treatments: ['Avoiding triggers', 'Moisturizers', 'Anti-itch creams', 'Cool compresses', 'Antihistamines', 'Topical steroids', 'Keeping skin clean'],
      urgencyLevel: 'Low to High',
      whenToSeekHelp: ['Rash covers large area of body', 'Fever with rash', 'Blistering', 'Severe pain', 'Infection signs (swelling, warmth)', 'Difficulty breathing with rash'],
      medicines: {
        allopathic: [
          {
            name: 'Hydrocortisone cream',
            dosage: 'Apply thin layer 1-4 times daily',
            precautions: 'Use for limited time, avoid on face'
          },
          {
            name: 'Diphenhydramine (Benadryl)',
            dosage: '25-50mg every 4-6 hours',
            precautions: 'May cause drowsiness, avoid driving'
          }
        ],
        ayurvedic: [
          {
            name: 'Neem',
            usage: 'Apply paste to affected area',
            benefits: 'Anti-inflammatory, antimicrobial'
          },
          {
            name: 'Turmeric paste',
            usage: 'Mix with water, apply to affected area',
            benefits: 'Reduces inflammation, soothes skin'
          }
        ]
      }
    }
  ];

  // Symptom categories
  const categories = [
    { id: 'all', name: 'All Symptoms', icon: FaSearch },
    { id: 'common', name: 'Common Symptoms', icon: FaThermometerHalf },
    { id: 'digestive', name: 'Digestive', icon: GiMedicines },
    { id: 'respiratory', name: 'Respiratory', icon: FaThermometerHalf },
    { id: 'pain', name: 'Pain & Discomfort', icon: FaPills },
    { id: 'cardiovascular', name: 'Cardiovascular', icon: FaPills },
    { id: 'skin', name: 'Skin Conditions', icon: FaUser },
    { id: 'sleep', name: 'Sleep Issues', icon: FaUser },
  ];

  // Filter symptoms by category
  const getFilteredSymptoms = () => {
    let filtered = commonSymptoms;
    if (selectedCategory !== 'all') {
      switch (selectedCategory) {
        case 'common':
          filtered = commonSymptoms.filter(s => ['Fever', 'Headache', 'Cough', 'Weakness', 'Nausea'].includes(s.name));
          break;
        case 'digestive':
          filtered = commonSymptoms.filter(s => ['Stomach Pain', 'Nausea'].includes(s.name));
          break;
        case 'respiratory':
          filtered = commonSymptoms.filter(s => s.name === 'Cough');
          break;
        case 'pain':
          filtered = commonSymptoms.filter(s => ['Headache', 'Joint Pain', 'Stomach Pain'].includes(s.name));
          break;
        case 'cardiovascular':
          filtered = commonSymptoms.filter(s => ['High Blood Pressure', 'Low Blood Pressure'].includes(s.name));
          break;
        case 'skin':
          filtered = commonSymptoms.filter(s => ['Skin Rash'].includes(s.name));
          break;
        case 'sleep':
          filtered = commonSymptoms.filter(s => ['Insomnia'].includes(s.name));
          break;
        default:
          break;
      }
    }
    return filtered;
  };

  // Filter symptoms by search query
  const filteredSymptoms = getFilteredSymptoms().filter(symptom =>
    symptom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Keyboard navigation for suggestions
  useEffect(() => {
    if (!showSuggestions) return;
    setHighlightIndex(-1);
  }, [showSuggestions, searchQuery, selectedCategory]);

  const onKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => Math.min(prev + 1, filteredSymptoms.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlightIndex >= 0 && highlightIndex < filteredSymptoms.length) {
        handleSymptomSelect(filteredSymptoms[highlightIndex]);
      } else if (filteredSymptoms.length > 0) {
        handleSymptomSelect(filteredSymptoms[0]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Effect to handle URL search parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
      // Find matching symptom
      const matchingSymptom = getFilteredSymptoms().find(symptom =>
        symptom.name.toLowerCase().includes(queryParam.toLowerCase())
      );
      if (matchingSymptom) {
        setSelectedSymptom(matchingSymptom);
        // Save to search history if user is logged in
        if (user) {
          saveToSearchHistory(queryParam, 'symptom');
        }
      }
    }
  }, [location.search]);

  // Save search to history
  const saveToSearchHistory = async (query, type) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5001/api/users/search-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: query,
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

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery) {
      navigate(`/symptoms?q=${encodeURIComponent(trimmedQuery)}`, { replace: true });
      
    if (filteredSymptoms.length > 0) {
      setSelectedSymptom(filteredSymptoms[0]);
        // Save to search history if user is logged in
        if (user) {
          saveToSearchHistory(trimmedQuery, 'symptom');
        }
      }
    }
    setShowSuggestions(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    
    // Clear selected symptom when input is cleared
    if (!value.trim()) {
      setSelectedSymptom(null);
      // Update URL to remove query parameter
      navigate('/symptoms', { replace: true });
    }
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedSymptom(null);
    navigate('/symptoms', { replace: true });
  };

  const addSelectedItem = (symptom) => {
    if (selectedItems.find(s => s.id === symptom.id)) return;
    setSelectedItems(prev => [...prev, { id: symptom.id, name: symptom.name, severity: 'moderate', duration: '1-3 days' }]);
  };

  const removeSelectedItem = (id) => {
    setSelectedItems(prev => prev.filter(s => s.id !== id));
  };

  const updateSelectedItem = (id, field, value) => {
    setSelectedItems(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSymptomSelect = async (symptom) => {
    setSearchQuery(symptom.name);
    setSelectedSymptom(symptom);
    setShowSuggestions(false);
    addSelectedItem(symptom);
    navigate(`/symptoms?q=${encodeURIComponent(symptom.name)}`, { replace: true });
    if (user) {
      saveToSearchHistory(symptom.name, 'symptom');
    }
    
    // Get AI insights for the selected symptom
    try {
      setLoadingInsights(true);
      setAiInsights('');
      const insights = await getHealthInformation(symptom.name);
      setAiInsights(insights);
    } catch (error) {
      console.error('Error getting AI insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  const analyzeSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      setLoadingInsights(true);
      setAiInsights('');
      const prompt = `Symptoms: ${selectedItems.map(s => `${s.name} (severity: ${s.severity}, duration: ${s.duration})`).join(', ')}. Provide likely causes, red flags, and next steps.`;
      const insights = await getHealthInformation(prompt);
      setAiInsights(insights);
      // save diagnosis history if logged in
      const token = localStorage.getItem('token');
      if (user && token) {
        await fetch('http://localhost:5001/api/diagnosis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user?._id,
            symptoms: selectedItems,
            result: insights,
            createdAt: new Date().toISOString()
          })
        });
      }
    } catch (e) {
      console.error('Analyze failed', e);
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="symptoms-page">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-logo">
          <Link to="/">MediVerse</Link>
          <span className="subtitle">Health Guide</span>
        </div>
        <div className="nav-links">
          <Link to="/"><FaHome /> Home</Link>
          <Link to="/symptoms" className="active"><FaSearch /> Symptoms</Link>
          <Link to="/library"><FaBook /> Medicine Library</Link>
          <Link to="/chat"><FaRobot /> Chat Assistant</Link>
          <Link to="/profile"><FaUser /> Profile</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Symptom Checker</h1>
          <p className="hero-subtitle">Discover comprehensive health information with AI-powered insights</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">11+</span>
              <span className="stat-label">Common Symptoms</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2</span>
              <span className="stat-label">Medicine Types</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">AI</span>
              <span className="stat-label">Powered Insights</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-header">
            <h2>Find Your Symptoms</h2>
            <p>Get instant information about symptoms, causes, and treatments</p>
          </div>
          <div className="search-box-container">
            <SearchBar
              placeholder="Type symptoms like 'fever', 'headache', 'cough'..."
              value={searchQuery}
              onChange={handleSearchChange}
              onSubmit={handleSearch}
              onClear={handleSearchClear}
              size="large"
              inputRef={inputRef}
              onKeyDown={onKeyDown}
            />
            {showSuggestions && (
              <div className="suggestions-dropdown">
                {filteredSymptoms.length === 0 ? (
                  <div className="no-results">No results. Try different terms.</div>
                ) : (
                  filteredSymptoms.map((symptom, index) => (
                    <div
                      key={symptom.id}
                      className={`suggestion-item ${index === highlightIndex ? 'highlight' : ''}`}
                      onClick={() => handleSymptomSelect(symptom)}
                      onMouseEnter={() => setHighlightIndex(index)}
                    >
                      <FaThermometerHalf className="suggestion-icon" />
                      <div className="suggestion-content">
                        <span className="suggestion-name">{symptom.name}</span>
                        <span className="suggestion-desc">{symptom.description.substring(0, 60)}...</span>
                      </div>
                      <span className={`urgency-badge ${symptom.urgencyLevel.toLowerCase().replace(' ', '-')}`}>
                        {symptom.urgencyLevel}
                      </span>
                      <button className="add-chip-btn" onClick={(e) => { e.stopPropagation(); addSelectedItem(symptom); }}>Add</button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected chips and controls */}
          <div className="selected-chips">
            {selectedItems.length === 0 ? (
              <div className="empty-selected">No symptoms selected.</div>
            ) : (
              selectedItems.map(item => (
                <div key={item.id} className="chip">
                  <span className="chip-name">{item.name}</span>
                  <select className="chip-select" value={item.severity} onChange={(e) => updateSelectedItem(item.id, 'severity', e.target.value)}>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                  <select className="chip-select" value={item.duration} onChange={(e) => updateSelectedItem(item.id, 'duration', e.target.value)}>
                    <option value="hours">Hours</option>
                    <option value="1-3 days">1-3 days</option>
                    <option value=">3 days">More than 3 days</option>
                    <option value=">1 week">More than 1 week</option>
                  </select>
                  <button className="chip-remove" onClick={() => removeSelectedItem(item.id)}><FaTimes /></button>
                </div>
              ))
            )}
          </div>

          <div className="analyze-row">
            <button className="analyze-btn" onClick={analyzeSelected} disabled={selectedItems.length === 0 || loadingInsights}>
              {loadingInsights ? 'Analyzing…' : 'Analyze Selected'}
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="categories-container">
          <div className="categories-header">
            <h2>Browse by Category</h2>
            <p>Explore symptoms organized by body systems and conditions</p>
          </div>
          <div className="category-grid">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="category-icon-wrapper">
                  <category.icon className="category-icon" />
                </div>
                <span className="category-name">{category.name}</span>
                <span className="category-count">
                  {category.id === 'all' ? commonSymptoms.length : 
                   getFilteredSymptoms().filter(s => {
                     switch (category.id) {
                       case 'common': return ['Fever', 'Headache', 'Cough', 'Weakness', 'Nausea'].includes(s.name);
                       case 'digestive': return ['Stomach Pain', 'Nausea'].includes(s.name);
                       case 'respiratory': return s.name === 'Cough';
                       case 'pain': return ['Headache', 'Joint Pain', 'Stomach Pain'].includes(s.name);
                       case 'cardiovascular': return ['High Blood Pressure', 'Low Blood Pressure'].includes(s.name);
                       case 'skin': return ['Skin Rash'].includes(s.name);
                       case 'sleep': return ['Insomnia'].includes(s.name);
                       default: return false;
                     }
                   }).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Common Symptoms Grid */}
      {!selectedSymptom && (
        <section className="common-symptoms-section">
          <div className="common-symptoms-container">
            <div className="symptoms-header">
              <h2>Common Symptoms and Conditions</h2>
              <p>Click on any symptom to get detailed information and treatment options</p>
            </div>
            <div className="symptoms-grid">
              {filteredSymptoms.map(symptom => (
                <div
                  key={symptom.id}
                  className="symptom-card-preview"
                  onClick={() => handleSymptomSelect(symptom)}
                >
                  <div className="symptom-card-header">
                    <div className="symptom-icon">
                      <FaThermometerHalf />
                    </div>
                    <span className={`urgency-badge ${symptom.urgencyLevel.toLowerCase().replace(' ', '-')}`}>
                      {symptom.urgencyLevel}
                    </span>
                  </div>
                  <div className="symptom-card-content">
                    <h3>{symptom.name}</h3>
                    <p>{symptom.description}</p>
                    <div className="symptom-tags">
                      {symptom.possibleCauses.slice(0, 2).map((cause, index) => (
                        <span key={index} className="symptom-tag">{cause}</span>
                      ))}
                    </div>
                  </div>
                  <div className="symptom-card-footer">
                    <button className="view-details-btn">
                      <span>View Details</span>
                      <BsArrowRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Selected Symptom Details */}
      {selectedSymptom && (
        <section className="symptom-details">
          <div className="symptom-card">
            <div className="symptom-header">
            <h2>{selectedSymptom.name}</h2>
              <span className={`urgency-badge large ${selectedSymptom.urgencyLevel.toLowerCase()}`}>
                {selectedSymptom.urgencyLevel}
              </span>
            </div>
            <p className="description">{selectedSymptom.description}</p>

            <div className="details-grid">
              <div className="detail-section">
                <h3><BiCheckCircle /> Possible Causes</h3>
                <ul className="causes-list">
                  {selectedSymptom.possibleCauses.map((cause, index) => (
                    <li key={index}>
                      <BiCheckCircle className="list-icon" />
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h3><BiCheckCircle /> Recommended Treatments</h3>
                <ul className="treatment-list">
                  {selectedSymptom.treatments.map((treatment, index) => (
                    <li key={index}>
                      <BiCheckCircle className="list-icon" />
                      {treatment}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="when-to-seek-help">
              <h3><BiErrorCircle /> When to Seek Medical Help</h3>
              <ul className="help-list">
                {selectedSymptom.whenToSeekHelp.map((condition, index) => (
                  <li key={index}>
                    <BiErrorCircle className="list-icon error" />
                    {condition}
                  </li>
                ))}
              </ul>
            </div>

            <div className="medicines-section">
              <h3>Recommended Medicines</h3>
              
              <div className="medicine-types">
                <div className="medicine-category allopathic">
                  <h4>
                    <GiMedicines className="medicine-icon" />
                    Allopathic Medicines
                  </h4>
                  <div className="medicine-list">
                    {selectedSymptom.medicines.allopathic.map((medicine, index) => (
                      <div key={index} className="medicine-item">
                        <h5>{medicine.name}</h5>
                        <p><strong>Dosage:</strong> {medicine.dosage}</p>
                        <p><strong>Precautions:</strong> {medicine.precautions}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="medicine-category ayurvedic">
                  <h4>
                    <FaPills className="medicine-icon" />
                    Ayurvedic Remedies
                  </h4>
                  <div className="medicine-list">
                    {selectedSymptom.medicines.ayurvedic.map((medicine, index) => (
                      <div key={index} className="medicine-item">
                        <h5>{medicine.name}</h5>
                        <p><strong>Usage:</strong> {medicine.usage}</p>
                        <p><strong>Benefits:</strong> {medicine.benefits}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI-powered insights section */}
            <div className="ai-insights-section">
              <h3>
                <FaLightbulb className="insights-icon" />
                DeepSeek AI Insights
              </h3>
              {loadingInsights ? (
                <div className="loading-insights">
                  <div className="loading-spinner"></div>
                  <p>Loading additional insights...</p>
                </div>
              ) : (
                aiInsights ? (
                  <div className="insights-content">
                    {aiInsights}
                  </div>
                ) : (
                  <div className="no-insights">
                    <p>Additional AI-powered insights are currently unavailable.</p>
                  </div>
                )
              )}
            </div>

            <div className="disclaimer">
              <p>Note: This information is for educational purposes only. Always consult with a healthcare professional for proper diagnosis and treatment.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Symptoms; 