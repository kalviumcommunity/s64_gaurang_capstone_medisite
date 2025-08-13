import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  onSubmit, 
  onClear,
  showClearButton = true,
  size = "medium", // small, medium, large
  showAnimation = true,
  autoFocus = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`search-bar-container ${size} ${showAnimation ? 'animate' : ''} ${isFocused ? 'focused' : ''}`}
    >
      <div className="search-bar-wrapper">
        <div className="search-icon-wrapper">
          <FaSearch className="search-icon" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={placeholder}
        />
        {showClearButton && value && (
          <button
            type="button"
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>
      <button 
        type="submit" 
        className="search-submit-button"
        aria-label="Submit search"
        disabled={!value?.trim()}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar; 