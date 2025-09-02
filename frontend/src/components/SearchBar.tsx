import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex shadow-xl rounded-full overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search query..."
          className="input input-lg flex-grow rounded-r-none border-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="btn btn-lg btn-primary rounded-l-none"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Searching...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;