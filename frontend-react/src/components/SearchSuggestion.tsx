import React from 'react';

interface SearchSuggestionProps {
  onSuggestionClick: (query: string) => void;
}

const SearchSuggestion: React.FC<SearchSuggestionProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    {
      title: "AI & Machine Learning",
      query: "AI machine learning",
      description: "Explore neural networks, deep learning, and AI applications",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      bgColor: "bg-primary",
      textColor: "text-primary-content",
      tags: ["Neural Networks", "Deep Learning", "NLP"]
    },
    {
      title: "Web Development",
      query: "web development frameworks",
      description: "Modern frameworks, libraries, and best practices for web apps",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      bgColor: "bg-secondary",
      textColor: "text-secondary-content",
      tags: ["React", "Vue", "Angular"]
    },
    {
      title: "Data Science",
      query: "data science tutorials",
      description: "Statistics, visualization, and machine learning with Python/R",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bgColor: "bg-accent",
      textColor: "text-accent-content",
      tags: ["Python", "Pandas", "Scikit-learn"]
    }
  ];

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-6 text-center binary-gradient-text">Popular Categories</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="card bg-base-100 border border-base-200 hover:border-primary/30 transition-all cursor-pointer shadow-xl hover:shadow-2xl transform hover:-translate-y-2 duration-300"
            onClick={() => onSuggestionClick(suggestion.query)}
          >
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className={`${suggestion.bgColor} ${suggestion.textColor} p-3 rounded-full mr-4 animate-float`}>
                  {suggestion.icon}
                </div>
                <h3 className="card-title text-lg m-0 binary-gradient-text">{suggestion.title}</h3>
              </div>
              
              <p className="text-base-content/80 mb-4">{suggestion.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {suggestion.tags.map((tag, tagIndex) => (
                  <div key={tagIndex} className="badge badge-outline badge-sm animate-fadeIn">
                    {tag}
                  </div>
                ))}
              </div>
              
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm btn-primary transform hover:scale-105 transition-transform shadow-glow">
                  Explore
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestion;