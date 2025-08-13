import React, { useState } from 'react';

const DrugSearch = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(`https://dailymed.nlm.nih.gov/dailymed/services/v2/drugname.json?drug_name=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch drug details');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('No details found or an error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drug-search-page" style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h2>Search Drug Details (Powered by DailyMed)</h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Enter drug name (e.g., paracetamol)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '1px solid #90caf9' }}
        />
        <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: 8, background: '#2196f3', color: 'white', border: 'none' }}>Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && result.data && result.data.length > 0 && (
        <div className="drug-results" style={{ background: '#f0f7ff', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 8px #bbdefb' }}>
          <h3>Results for "{query}"</h3>
          <ul>
            {result.data.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '1rem' }}>
                <strong>{item.drug_name}</strong><br />
                <span>Set ID: {item.setid}</span><br />
                <span>RXCUI: {item.rxcui}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {result && result.data && result.data.length === 0 && (
        <p>No results found for "{query}".</p>
      )}
    </div>
  );
};

export default DrugSearch; 