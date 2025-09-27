import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaBook, FaUser, FaThermometerHalf, FaPills, FaLightbulb, FaArrowLeft } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import './SymptomDetail.css';

const SymptomDetail = () => {
  const { symptomName } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [aiInsights, setAiInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Common symptoms database (same as Symptoms.jsx)
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

  // Find the symptom by name
  useEffect(() => {
    if (symptomName) {
      const decodedName = decodeURIComponent(symptomName);
      const symptom = commonSymptoms.find(s => 
        s.name.toLowerCase() === decodedName.toLowerCase()
      );
      if (symptom) {
        setSelectedSymptom(symptom);
        // Save to search history if user is logged in
        if (user) {
          saveToSearchHistory(decodedName, 'symptom');
        }
        // Get AI insights
        fetchAIInsights(symptom);
      } else {
        // If symptom not found, redirect to symptoms page
        navigate('/symptoms');
      }
    }
  }, [symptomName, user, navigate]);

  // Save search to history
  const saveToSearchHistory = async (query, type) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta?.env?.VITE_BACKEND_URL || 'https://s64-gaurang-capstone-medisite-12.onrender.com'}/api/users/search-history`, {
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

  // Fetch AI insights
  const fetchAIInsights = async (symptom) => {
    try {
      setLoadingInsights(true);
      setAiInsights('');
      console.log('Fetching AI insights for:', symptom.name);
      const data = await apiService.getHealthInformation(symptom.name);
      const insights = data.response;
      console.log('AI insights received:', insights);
      setAiInsights(insights);
    } catch (error) {
      console.error('Error getting AI insights:', error);
      setAiInsights('Sorry, I encountered an error while fetching AI insights. Please try again later.');
    } finally {
      setLoadingInsights(false);
    }
  };

  if (!selectedSymptom) {
    return (
      <div className="symptom-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading symptom details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="symptom-detail-page">
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
          <Link to="/profile"><FaUser /> Profile</Link>
        </div>
      </nav>

      {/* Back Button */}
      <div className="back-section">
        <button className="back-button" onClick={() => navigate('/symptoms')}>
          <FaArrowLeft />
          Back to Symptoms
        </button>
      </div>

      {/* Symptom Details */}
      <section className="symptom-details">
        <div className="symptom-card">
          <div className="symptom-header">
            <h1>{selectedSymptom.name}</h1>
            <span className={`urgency-badge large ${selectedSymptom.urgencyLevel.toLowerCase().replace(' ', '-')}`}>
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
            <div className="insights-header">
              <h3>
                <FaLightbulb className="insights-icon" />
                AI Health Insights
              </h3>
              {!loadingInsights && !aiInsights && (
                <div className="insights-actions">
                  <button 
                    className="retry-insights-btn"
                    onClick={() => fetchAIInsights(selectedSymptom)}
                  >
                    Get AI Insights
                  </button>
                  <button 
                    className="test-api-btn"
                    onClick={async () => {
                      const result = await apiService.testAIConnection();
                      alert(result.success ? 'API is working!' : `API Error: ${result.message}`);
                    }}
                  >
                    Test API
                  </button>
                </div>
              )}
            </div>
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
                  <p>Click "Get AI Insights" to fetch additional information about {selectedSymptom.name}.</p>
                </div>
              )
            )}
          </div>

          <div className="disclaimer">
            <p>Note: This information is for educational purposes only. Always consult with a healthcare professional for proper diagnosis and treatment.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SymptomDetail;
