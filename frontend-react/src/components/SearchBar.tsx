import React, { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchMode, setSearchMode] = useState<'text' | 'image' | 'voice'>('text');
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Mock search suggestions
  const suggestions = [
    "AI machine learning tutorials",
    "web development frameworks",
    "data science courses",
    "cloud computing services",
    "cybersecurity best practices"
  ];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={searchBarRef} className="w-full">
      <form onSubmit={handleSubmit} className="mb-2">
        <div className="form-control relative">
          <div className="input-group input-group-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              placeholder="Ask anything..."
              className="input input-lg input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary rounded-full pr-48 transition-all duration-300 hover:shadow-lg"
              disabled={loading}
              onFocus={() => setShowSuggestions(query.length > 0)}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              {/* Search Modes */}
              <div className="dropdown dropdown-top dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-ghost btn-circle transform hover:scale-110 transition-transform">
                  {searchMode === 'text' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {searchMode === 'image' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {searchMode === 'voice' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-box w-40 mt-2 border border-base-300">
                  <li>
                    <button 
                      type="button" 
                      className={`flex items-center transition-all duration-300 hover:bg-base-200 p-2 rounded-lg ${
                        searchMode === 'text' ? 'text-primary font-medium bg-base-200' : ''
                      }`}
                      onClick={() => setSearchMode('text')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Text
                    </button>
                  </li>
                  <li>
                    <button 
                      type="button" 
                      className={`flex items-center transition-all duration-300 hover:bg-base-200 p-2 rounded-lg ${
                        searchMode === 'image' ? 'text-primary font-medium bg-base-200' : ''
                      }`}
                      onClick={() => setSearchMode('image')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Image
                    </button>
                  </li>
                  <li>
                    <button 
                      type="button" 
                      className={`flex items-center transition-all duration-300 hover:bg-base-200 p-2 rounded-lg ${
                        searchMode === 'voice' ? 'text-primary font-medium bg-base-200' : ''
                      }`}
                      onClick={() => setSearchMode('voice')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Voice
                    </button>
                  </li>
                </ul>
              </div>
              
              {/* Clear button */}
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn btn-sm btn-ghost btn-circle transform hover:scale-110 transition-transform"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              {/* Search button */}
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="btn btn-lg btn-primary rounded-full min-h-0 h-10 transform hover:scale-105 transition-transform shadow-glow"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-200 rounded-box shadow-2xl max-h-60 overflow-y-auto animate-fadeIn">
          <ul className="py-2">
            {suggestions
              .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
              .map((suggestion, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-base-200 flex items-center transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {suggestion}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;