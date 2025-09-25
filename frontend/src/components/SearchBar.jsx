import React from 'react';
import './SearchBar.css';
import { FaTimes } from 'react-icons/fa';

const SearchBar = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSubmit,
  onClear,
  size = 'medium',
  inputRef,
  onKeyDown
}) => {
  const handleSubmit = (event) => {
    if (onSubmit) {
      onSubmit(event);
    } else {
      event.preventDefault();
    }
  };

  return (
    <form className={`search-bar ${size}`} onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        ref={inputRef}
        onKeyDown={onKeyDown}
      />
      {value ? (
        <button
          type="button"
          className="clear-btn"
          onClick={onClear}
          aria-label="Clear search"
        >
          <FaTimes />
        </button>
      ) : null}
      <button type="submit" className="submit-btn">Search</button>
    </form>
  );
};

export default SearchBar;