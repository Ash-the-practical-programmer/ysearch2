import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId] = useState('user_' + Math.random().toString(36).substr(2, 9)); // Simple user ID
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setLoading(true);
    
    try {
      // In a real app, this would call your backend API
      // const response = await fetch('http://localhost:8000/search', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ query: searchQuery, user_id: userId }),
      // });
      // const data = await response.json();
      
      // Mock search results for demonstration
      const mockResults = [
        {
          id: '1',
          title: 'Introduction to AI Agents',
          url: 'https://example.com/ai-agents',
          snippet: 'Learn about the latest developments in AI agent technology and how they are transforming search experiences.',
          score: 0.95,
          personalized_score: 0.98
        },
        {
          id: '2',
          title: 'Machine Learning Algorithms',
          url: 'https://example.com/ml-algorithms',
          snippet: 'Comprehensive guide to machine learning algorithms used in modern search platforms.',
          score: 0.87,
          personalized_score: 0.91
        },
        {
          id: '3',
          title: 'Natural Language Processing',
          url: 'https://example.com/nlp',
          snippet: 'Understanding how NLP powers intelligent search and question answering systems.',
          score: 0.82,
          personalized_score: 0.85
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResults(mockResults);
      setActiveTab('results');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (resultId: string, feedbackType: string) => {
    try {
      // In a real app, this would send feedback to the backend
      // await fetch('http://localhost:8000/feedback', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ 
      //     query, 
      //     result_id: resultId, 
      //     user_id: userId, 
      //     feedback_type: feedbackType 
      //   }),
      // });
      
      console.log(`Feedback recorded for result ${resultId}: ${feedbackType}`);
      
      // Update UI to show feedback was recorded
      setResults(prevResults => 
        prevResults.map(result => 
          result.id === resultId 
            ? { ...result, feedbackGiven: feedbackType } 
            : result
        )
      );
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`} data-theme={darkMode ? "dark" : "light"}>
      <div className="bg-base-100 min-h-screen">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary to-secondary text-primary-content p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-white text-primary p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">YSearch2</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src="https://api.dicebear.com/7.x/initials/svg?seed=User" alt="User" />
                  </div>
                </label>
                <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <a className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li><a>Settings</a></li>
                  <li><a>Logout</a></li>
                </ul>
              </div>
              <button 
                className="btn btn-ghost btn-circle"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>
        
        {/* Navigation Tabs */}
        <div className="container mx-auto px-4">
          <div className="tabs tabs-boxed mt-4">
            <a 
              className={`tab ${activeTab === 'search' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              Search
            </a>
            <a 
              className={`tab ${activeTab === 'results' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              Results
            </a>
            <a 
              className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </a>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="container mx-auto p-4">
          {/* Search Section */}
          {activeTab === 'search' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4">Intelligent Search Platform</h2>
                <p className="text-xl text-base-content/70 mb-8">Personalized results powered by AI agents</p>
                
                <SearchBar onSearch={handleSearch} loading={loading} />
                
                {/* Search Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                  <div className="card bg-base-200 hover:bg-base-300 transition-all cursor-pointer" onClick={() => handleSearch('AI machine learning')}>
                    <div className="card-body items-center text-center">
                      <div className="bg-primary text-primary-content p-3 rounded-full mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="card-title text-lg">AI & Machine Learning</h3>
                    </div>
                  </div>
                  
                  <div className="card bg-base-200 hover:bg-base-300 transition-all cursor-pointer" onClick={() => handleSearch('web development frameworks')}>
                    <div className="card-body items-center text-center">
                      <div className="bg-secondary text-secondary-content p-3 rounded-full mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <h3 className="card-title text-lg">Web Development</h3>
                    </div>
                  </div>
                  
                  <div className="card bg-base-200 hover:bg-base-300 transition-all cursor-pointer" onClick={() => handleSearch('data science tutorials')}>
                    <div className="card-body items-center text-center">
                      <div className="bg-accent text-accent-content p-3 rounded-full mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="card-title text-lg">Data Science</h3>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Features Section */}
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-center mb-8">Why Choose YSearch2?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">
                        <div className="bg-primary text-primary-content p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        AI-Powered
                      </h2>
                      <p>Intelligent agents process your queries using advanced NLP and reasoning capabilities.</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-primary btn-sm">Learn more</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">
                        <div className="bg-secondary text-secondary-content p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        Personalized
                      </h2>
                      <p>Results tailored to your preferences and search history for a unique experience.</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-secondary btn-sm">Learn more</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">
                        <div className="bg-accent text-accent-content p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        Continuously Learning
                      </h2>
                      <p>System improves over time based on your feedback and interactions.</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-accent btn-sm">Learn more</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Results Section */}
          {activeTab === 'results' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Search Results for "{query}"</h2>
                <div className="flex items-center space-x-2">
                  <span className="badge badge-lg badge-primary">{results.length} results</span>
                  <div className="form-control">
                    <select className="select select-bordered select-sm">
                      <option>Relevance</option>
                      <option>Personalized</option>
                      <option>Date</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {results.map((result, index) => (
                  <ResultCard
                    key={index}
                    title={result.title}
                    url={result.url}
                    snippet={result.snippet}
                    score={result.score}
                    personalizedScore={result.personalized_score}
                    onFeedback={(feedbackType) => handleFeedback(result.id, feedbackType)}
                    feedbackGiven={result.feedbackGiven}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <div className="join">
                  <button className="join-item btn btn-outline">1</button>
                  <button className="join-item btn btn-outline btn-active">2</button>
                  <button className="join-item btn btn-outline">3</button>
                  <button className="join-item btn btn-outline">Next</button>
                </div>
              </div>
            </div>
          )}
          
          {/* Analytics Section */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Search Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card bg-primary text-primary-content">
                  <div className="card-body">
                    <h3 className="card-title">Total Searches</h3>
                    <p className="text-4xl font-bold">1,248</p>
                    <div className="text-sm">+12% from last month</div>
                  </div>
                </div>
                
                <div className="card bg-secondary text-secondary-content">
                  <div className="card-body">
                    <h3 className="card-title">Avg. Response Time</h3>
                    <p className="text-4xl font-bold">0.8s</p>
                    <div className="text-sm">-0.2s from last month</div>
                  </div>
                </div>
                
                <div className="card bg-accent text-accent-content">
                  <div className="card-body">
                    <h3 className="card-title">Personalization Rate</h3>
                    <p className="text-4xl font-bold">87%</p>
                    <div className="text-sm">+5% from last month</div>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-200 shadow-xl mb-8">
                <div className="card-body">
                  <h3 className="card-title">Search Trends</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-base-content/50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>Chart visualization would appear here</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">Top Queries</h3>
                    <div className="space-y-3">
                      {['AI machine learning', 'web development', 'data science', 'cloud computing', 'cybersecurity'].map((query, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{query}</span>
                          <span className="badge badge-outline">{100 - index * 15}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">User Feedback</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Positive</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-base-300 rounded-full h-2.5 mr-2">
                            <div className="bg-success h-2.5 rounded-full" style={{width: '75%'}}></div>
                          </div>
                          <span>75%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Neutral</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-base-300 rounded-full h-2.5 mr-2">
                            <div className="bg-warning h-2.5 rounded-full" style={{width: '15%'}}></div>
                          </div>
                          <span>15%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Negative</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-base-300 rounded-full h-2.5 mr-2">
                            <div className="bg-error h-2.5 rounded-full" style={{width: '10%'}}></div>
                          </div>
                          <span>10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className="footer footer-center p-10 bg-base-300 text-base-content mt-16">
          <div>
            <div className="grid grid-flow-col gap-4">
              <a className="link link-hover">About</a>
              <a className="link link-hover">Contact</a>
              <a className="link link-hover">Privacy</a>
              <a className="link link-hover">Terms</a>
            </div>
          </div>
          <div>
            <p>YSearch2 - Personalized Agentic Web Search Platform</p>
            <p className="text-sm">Powered by AI agents, DSPy, and SSRL</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;