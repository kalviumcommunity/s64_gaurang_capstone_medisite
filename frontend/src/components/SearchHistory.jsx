import React, { useState, useEffect } from 'react';
import { FaSearch, FaClock, FaPills, FaLeaf, FaTrash, FaFilter } from 'react-icons/fa';
import './SearchHistory.css';

const SearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta?.env?.VITE_BACKEND_URL || 'https://s64-gaurang-capstone-medisite-12.onrender.com'}/api/users/search-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          // If no history exists, set empty array
          setSearchHistory([]);
          return;
        }
        throw new Error(`Error fetching search history: ${response.statusText}`);
      }

      const data = await response.json();
      setSearchHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching search history:', error);
      setError(error.message);
      setSearchHistory([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta?.env?.VITE_BACKEND_URL || 'https://s64-gaurang-capstone-medisite-12.onrender.com'}/api/users/search-history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete search item');
      }

      setSearchHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting search item:', error);
      // Optionally show error to user
    }
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  const getIcon = (type) => {
    switch (type) {
      case 'allopathic':
        return <FaPills className="history-icon allopathic" />;
      case 'ayurvedic':
        return <FaLeaf className="history-icon ayurvedic" />;
      case 'symptom':
        return <FaSearch className="history-icon symptom" />;
      default:
        return <FaSearch className="history-icon" />;
    }
  };

  const filteredHistory = filter === 'all' 
    ? searchHistory 
    : searchHistory.filter(item => item.type === filter);

  if (loading) {
    return (
      <div className="search-history-loading">
        <div className="spinner"></div>
        <p>Loading search history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-history-error">
        <FaSearch className="error-icon" />
        <p>Error loading search history</p>
        <p className="error-message">{error}</p>
        <button onClick={fetchSearchHistory} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="search-history-container">
      <div className="search-history-header">
        <h2>Your Search History</h2>
        <div className="filter-controls">
          <FaFilter className="filter-icon" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Searches</option>
            <option value="allopathic">Allopathic</option>
            <option value="ayurvedic">Ayurvedic</option>
            <option value="symptom">Symptoms</option>
          </select>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="no-history">
          <FaSearch className="no-history-icon" />
          <p>No search history found</p>
          <p className="no-history-sub">Your recent searches will appear here</p>
        </div>
      ) : (
        <div className="search-history-list">
          {filteredHistory.map((item) => (
            <div key={item.id} className="search-history-item">
              <div className="search-item-content">
                {getIcon(item.type)}
                <div className="search-item-details">
                  <h3>{item.query}</h3>
                  <div className="search-meta">
                    <span className="search-type">{item.type}</span>
                    <span className="search-time">
                      <FaClock /> {getTimeAgo(item.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(item.id)}
                title="Delete search"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchHistory; 