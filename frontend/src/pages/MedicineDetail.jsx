import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './Library.css';
import { allopathicMedicines, ayurvedicMedicines } from '../data/medicines';
import apiService from '../services/apiService';

const MedicineDetail = () => {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const type = new URLSearchParams(location.search).get('type') || 'allopathic';

  const medicine = useMemo(() => {
    if (location.state?.medicine) return location.state.medicine;
    const normalized = decodeURIComponent(name).toLowerCase();
    const synonyms = {
      'paracetamol': 'acetaminophen',
      'tylenol': 'acetaminophen',
      'amoxycillin': 'amoxicillin'
    };
    const canonical = synonyms[normalized] || normalized;
    const list = type === 'ayurvedic' ? ayurvedicMedicines : allopathicMedicines;
    return list.find(m => m.name.toLowerCase() === canonical);
  }, [name, type, location.state]);

  const [aiInsights, setAiInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (!medicine?.name) return;
    const fetchInsights = async () => {
      try {
        setLoadingInsights(true);
        const data = await apiService.getMedicineInformation(medicine.name);
        setAiInsights(data.response);
      } catch (e) {
        // silent fail; keep insights empty
      } finally {
        setLoadingInsights(false);
      }
    };
    fetchInsights();
  }, [medicine?.name]);

  if (!medicine) {
    return (
      <div className="library-page">
        <Navigation />
        <div className="library-content">
          <button className="back-button" onClick={() => navigate(`/library?type=${type}`)}>← Back</button>
          <div className="medicine-card">
            <h2>Medicine not found</h2>
            <p>Please go back and choose another medicine.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="library-page">
      <Navigation />
      <div className="library-content">
        <button className="back-button" onClick={() => navigate(`/library?type=${type}`)}>← Back</button>
        <div className="medicine-card">
          <div className="medicine-header">
            <h2>{medicine.name}</h2>
            {medicine.category && <span className="medicine-type chip">{medicine.category}</span>}
          </div>
          {medicine.overview && <p className="medicine-description">{medicine.overview}</p>}

          <div className="medicine-details">
            {medicine.description && (
              <div className="detail-section">
                <h3>Description</h3>
                <p>{medicine.description}</p>
              </div>
            )}

            {medicine.dosage && (
              <div className="detail-section">
                <h3>Dosage</h3>
                <p>{medicine.dosage}</p>
              </div>
            )}

            {(medicine.uses || []).length > 0 && (
              <div className="detail-section">
                <h3>Uses</h3>
                <ul>
                  {(medicine.uses || []).map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            )}

            {(medicine.indications || []).length > 0 && (
              <div className="detail-section">
                <h3>Indications</h3>
                <ul>
                  {(medicine.indications || []).map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </div>
            )}

            {medicine.mechanism && (
              <div className="detail-section">
                <h3>How it works</h3>
                <p>{medicine.mechanism}</p>
              </div>
            )}

            {(medicine.sideEffects || []).length > 0 && (
              <div className="detail-section side-effects-section">
                <h3>Side Effects</h3>
                <ul className="side-effects">
                  {(medicine.sideEffects || []).map((effect, idx) => (
                    <li key={idx}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}

            {(medicine.precautions || []).length > 0 && (
              <div className="detail-section precautions-section">
                <h3>Precautions</h3>
                <ul className="precautions">
                  {(medicine.precautions || []).map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {(medicine.interactions || []).length > 0 && (
              <div className="detail-section">
                <h3>Drug/Herb Interactions</h3>
                <ul>
                  {(medicine.interactions || []).map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            )}

            {(medicine.availableForms || medicine.brands) && (
              <div className="detail-section">
                <h3>Forms & Brands</h3>
                {medicine.availableForms && (
                  <p><strong>Forms:</strong> {medicine.availableForms.join(', ')}</p>
                )}
                {medicine.brands && (
                  <p><strong>Brands:</strong> {medicine.brands.join(', ')}</p>
                )}
              </div>
            )}

            {(medicine.onset || medicine.duration) && (
              <div className="detail-section">
                <h3>Onset & Duration</h3>
                <p>
                  {medicine.onset && (<><strong>Onset:</strong> {medicine.onset} </>)}
                  {medicine.duration && (<><strong>| Duration:</strong> {medicine.duration}</>)}
                </p>
              </div>
            )}

            {(medicine.pregnancyUse || medicine.lactationUse) && (
              <div className="detail-section">
                <h3>Special Populations</h3>
                {medicine.pregnancyUse && (<p><strong>Pregnancy:</strong> {medicine.pregnancyUse}</p>)}
                {medicine.lactationUse && (<p><strong>Lactation:</strong> {medicine.lactationUse}</p>)}
              </div>
            )}

            {(medicine.storage || medicine.overdose) && (
              <div className="detail-section">
                <h3>Storage & Overdose</h3>
                {medicine.storage && (<p><strong>Storage:</strong> {medicine.storage}</p>)}
                {medicine.overdose && (<p><strong>Overdose:</strong> {medicine.overdose}</p>)}
              </div>
            )}
          </div>

          {/* AI Insights */}
          <div className="ai-insights-section">
            <h3>AI Insights</h3>
            {loadingInsights ? (
              <div className="loading-insights">
                <div className="spinner"></div>
                <p>Loading additional information...</p>
              </div>
            ) : (
              aiInsights ? (
                <div className="insights-content">
                  <pre style={{whiteSpace: 'pre-wrap'}}>{aiInsights}</pre>
                </div>
              ) : (
                <div className="no-insights">
                  <p>Additional AI-powered information is currently unavailable.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetail;


