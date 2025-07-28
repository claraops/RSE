import React from 'react';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher une action..."
        aria-label="Rechercher des actions RSE"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;