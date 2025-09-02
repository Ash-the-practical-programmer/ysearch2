import React from 'react';

interface SearchSuggestionProps {
  onSuggestionClick: (query: string) => void;
}

const SearchSuggestion: React.FC<SearchSuggestionProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    {
      title: "AI & Machine Learning",
      query: "AI machine learning",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      bgColor: "bg-primary",
      textColor: "text-primary-content"
    },
    {
      title: "Web Development",
      query: "web development frameworks",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      bgColor: "bg-secondary",
      textColor: "text-secondary-content"
    },
    {
      title: "Data Science",
      query: "data science tutorials",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bgColor: "bg-accent",
      textColor: "text-accent-content"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
      {suggestions.map((suggestion, index) => (
        <div 
          key={index} 
          className="card bg-base-200 hover:bg-base-300 transition-all cursor-pointer" 
          onClick={() => onSuggestionClick(suggestion.query)}
        >
          <div className="card-body items-center text-center">
            <div className={`${suggestion.bgColor} ${suggestion.textColor} p-3 rounded-full mb-3`}>
              {suggestion.icon}
            </div>
            <h3 className="card-title text-lg">{suggestion.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSuggestion;