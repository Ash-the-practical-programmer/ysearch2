import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SearchSuggestion from './components/SearchSuggestion';

// Types
interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  score: number;
  personalized_score?: number;
  type: string;
  feedbackGiven?: string;
  tags?: string[];
  date?: string;
  author?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark' | 'genz';
    resultLayout: 'list' | 'grid';
    notifications: boolean;
  };
  searchHistory: string[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

// Mock data
const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Introduction to AI Agents and Multi-Agent Systems',
    url: 'https://example.com/ai-agents',
    snippet: 'Learn about the latest developments in AI agent technology and how they are transforming search experiences with personalized results through collaborative intelligence.',
    score: 0.95,
    personalized_score: 0.98,
    type: 'article',
    tags: ['AI', 'Machine Learning', 'Agents'],
    date: '2023-10-15',
    author: 'Dr. Sarah Johnson'
  },
  {
    id: '2',
    title: 'Machine Learning Algorithms: A Comprehensive Guide',
    url: 'https://example.com/ml-algorithms',
    snippet: 'Comprehensive guide to machine learning algorithms used in modern search platforms for better ranking, personalization, and user experience optimization.',
    score: 0.87,
    personalized_score: 0.91,
    type: 'tutorial',
    tags: ['Tutorial', 'ML', 'Algorithms'],
    date: '2023-09-22',
    author: 'Prof. Michael Chen'
  },
  {
    id: '3',
    title: 'Natural Language Processing Fundamentals',
    url: 'https://example.com/nlp',
    snippet: 'Understanding how NLP powers intelligent search and question answering systems with semantic understanding, entity recognition, and contextual analysis.',
    score: 0.82,
    personalized_score: 0.85,
    type: 'guide',
    tags: ['NLP', 'Language', 'Processing'],
    date: '2023-08-30',
    author: 'Dr. Emily Rodriguez'
  },
  {
    id: '4',
    title: 'The Future of Search Technology',
    url: 'https://example.com/future-search',
    snippet: 'Exploring emerging trends in search technology including neural search, vector databases, agentic workflows, and quantum computing applications.',
    score: 0.78,
    personalized_score: 0.83,
    type: 'research',
    tags: ['Future', 'Technology', 'Research'],
    date: '2023-10-05',
    author: 'Dr. James Wilson'
  },
  {
    id: '5',
    title: 'Personalization in Search Engines',
    url: 'https://example.com/search-personalization',
    snippet: 'How modern search engines use user behavior, preferences, and contextual signals to deliver personalized results that match individual needs and intent.',
    score: 0.75,
    personalized_score: 0.80,
    type: 'article',
    tags: ['Personalization', 'Search', 'User Experience'],
    date: '2023-09-18',
    author: 'Dr. Lisa Thompson'
  }
];

const mockUser: User = {
  id: 'user_12345',
  name: 'Alex Morgan',
  email: 'alex@example.com',
  preferences: {
    theme: 'genz',
    resultLayout: 'list',
    notifications: true
  },
  searchHistory: [
    'AI machine learning tutorials',
    'web development frameworks',
    'data science courses',
    'cloud computing services'
  ]
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Feature Available',
    message: 'Try our new image search feature with enhanced AI capabilities',
    timestamp: '2 hours ago',
    read: false,
    type: 'info'
  },
  {
    id: '2',
    title: 'Search Improvement',
    message: 'Your personalized results have improved by 15% this week',
    timestamp: '1 day ago',
    read: true,
    type: 'success'
  },
  {
    id: '3',
    title: 'Maintenance Notice',
    message: 'Scheduled maintenance this Sunday from 2AM-4AM UTC',
    timestamp: '3 days ago',
    read: true,
    type: 'warning'
  }
];

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>(mockUser);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeView, setActiveView] = useState<'search' | 'dashboard' | 'history' | 'settings'>('search');
  const [resultLayout, setResultLayout] = useState<'list' | 'grid'>('list');
  const [filters, setFilters] = useState({
    type: 'all',
    date: 'any',
    sortBy: 'relevance'
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Initialize theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', user.preferences.theme);
  }, [user.preferences.theme]);

  // Toggle theme
  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'genz')[] = ['light', 'dark', 'genz'];
    const currentIndex = themes.indexOf(user.preferences.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: newTheme
      }
    }));
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Handle search
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setQuery(searchQuery);
    setLoading(true);
    setActiveView('search');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle result feedback
  const handleResultFeedback = (resultId: string, feedbackType: string) => {
    setResults(prevResults => 
      prevResults.map(result => 
        result.id === resultId 
          ? { ...result, feedbackGiven: feedbackType } 
          : result
      )
    );
  };

  // Mark notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Filter results based on filters
  const filteredResults = results.filter(result => {
    if (filters.type !== 'all' && result.type !== filters.type) return false;
    return true;
  });

  // Sort results based on sort option
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (filters.sortBy === 'relevance') {
      return (b.personalized_score || b.score) - (a.personalized_score || a.score);
    } else if (filters.sortBy === 'date') {
      return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
    }
    return 0;
  });

  // Unread notifications count
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-base-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-binary-gradient-radial rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-genz-gradient-2 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-genz-gradient-4 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Sidebar */}
      <div className={`fixed md:relative z-30 inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-base-200 border-r border-base-300`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary to-secondary text-primary-content p-2 rounded-lg animate-gradient">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold binary-gradient-text animate-gradient">YSearch</h1>
            </div>
            <button 
              className="md:hidden btn btn-sm btn-ghost" 
              onClick={() => setSidebarOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              <li>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    activeView === 'search' 
                      ? 'bg-primary text-primary-content shadow-glow' 
                      : 'hover:bg-base-300'
                  }`}
                  onClick={() => setActiveView('search')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    activeView === 'dashboard' 
                      ? 'bg-primary text-primary-content shadow-glow' 
                      : 'hover:bg-base-300'
                  }`}
                  onClick={() => setActiveView('dashboard')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Analytics</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    activeView === 'history' 
                      ? 'bg-primary text-primary-content shadow-glow' 
                      : 'hover:bg-base-300'
                  }`}
                  onClick={() => setActiveView('history')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>History</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    activeView === 'settings' 
                      ? 'bg-primary text-primary-content shadow-glow' 
                      : 'hover:bg-base-300'
                  }`}
                  onClick={() => setActiveView('settings')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </button>
              </li>
            </ul>
            
            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="px-4 text-sm font-semibold text-base-content/70 mb-2">Quick Actions</h3>
              <ul className="space-y-1">
                <li>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-base-300 transition-all duration-300 transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>New Search</span>
                  </button>
                </li>
                <li>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-base-300 transition-all duration-300 transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Export Results</span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
          
          {/* User Profile */}
          <div className="p-4 border-t border-base-300">
            <div className="flex items-center space-x-3">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 animate-pulse">
                  <img src="https://api.dicebear.com/7.x/initials/svg?seed=Alex&backgroundColor=00897b,43a047,546e7a,c0ca33,78909c&backgroundType=gradientLinear" alt="User" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-sm text-base-content/70 truncate">{user.email}</p>
              </div>
              <button className="btn btn-sm btn-ghost transform hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-base-100/80 backdrop-blur-sm border-b border-base-200 sticky top-0 z-20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <button 
                className="md:hidden btn btn-ghost btn-circle transform hover:scale-110 transition-transform" 
                onClick={() => setSidebarOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="hidden md:block">
                <h2 className="text-xl font-bold capitalize binary-gradient-text">{activeView}</h2>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Search Bar for non-search views */}
              {activeView !== 'search' && (
                <div className="hidden md:block w-64">
                  <SearchBar onSearch={handleSearch} loading={loading} />
                </div>
              )}
              
              {/* Notifications */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle indicator transform hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotifications > 0 && (
                    <span className="indicator-item badge badge-secondary badge-sm animate-pulse badge-animated">{unreadNotifications}</span>
                  )}
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-box w-80 mt-3 border border-base-300">
                  <div className="flex justify-between items-center px-4 py-3 border-b border-base-300">
                    <h3 className="font-bold">Notifications</h3>
                    <button 
                      className="text-sm text-primary hover:text-primary-focus transform hover:scale-105 transition-transform"
                      onClick={markAllNotificationsAsRead}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <li key={notification.id} className="border-b border-base-200 last:border-b-0">
                          <button 
                            className={`p-4 flex items-start w-full text-left transition-all duration-300 hover:bg-base-200 ${
                              !notification.read ? 'bg-base-200/50' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className={`w-3 h-3 rounded-full mt-2 mr-3 flex-shrink-0 animate-pulse ${
                              notification.type === 'info' ? 'bg-info' :
                              notification.type === 'success' ? 'bg-success' :
                              notification.type === 'warning' ? 'bg-warning' :
                              'bg-error'
                            }`}></div>
                            <div className="text-left flex-1">
                              <div className="font-medium">{notification.title}</div>
                              <div className="text-sm text-base-content/70">{notification.message}</div>
                              <div className="text-xs text-base-content/50 mt-1">{notification.timestamp}</div>
                            </div>
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="p-6 text-center text-base-content/70">No notifications</li>
                    )}
                  </div>
                </ul>
              </div>
              
              {/* Theme Toggle */}
              <button 
                className="btn btn-ghost btn-circle transform hover:scale-110 transition-transform"
                onClick={toggleTheme}
              >
                {user.preferences.theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : user.preferences.theme === 'genz' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              {/* User Menu */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar transform hover:scale-110 transition-transform">
                  <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src="https://api.dicebear.com/7.x/initials/svg?seed=Alex&backgroundColor=00897b,43a047,546e7a,c0ca33,78909c&backgroundType=gradientLinear" alt="User" />
                  </div>
                </label>
                <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow-2xl bg-base-100 rounded-box w-52 border border-base-300">
                  <li><a className="hover:bg-base-200 transition-all">Profile</a></li>
                  <li><a className="hover:bg-base-200 transition-all">Settings</a></li>
                  <li><a className="hover:bg-base-200 transition-all justify-between">History <span className="badge badge-primary animate-pulse">New</span></a></li>
                  <li className="border-t border-base-200 mt-2 pt-2"><a className="hover:bg-base-200 transition-all">Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </header>
        
        {/* Mobile Search Bar */}
        {activeView === 'search' && (
          <div className="md:hidden p-4 border-b border-base-200">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
        )}
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeView === 'search' && (
            <div className="max-w-6xl mx-auto">
              {results.length === 0 && !loading ? (
                <div className="text-center py-12">
                  <div className="bg-base-200 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6 animate-float">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2 binary-gradient-text">Search for anything</h2>
                  <p className="text-base-content/70 mb-8">Enter a query above to get started with our AI-powered search</p>
                  
                  <SearchSuggestion onSuggestionClick={handleSearch} />
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold binary-gradient-text">Search Results</h2>
                      <p className="text-base-content/70">{results.length} results found</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {/* Layout Toggle */}
                      <div className="btn-group">
                        <button 
                          className={`btn btn-sm transform hover:scale-105 transition-transform ${
                            resultLayout === 'list' ? 'btn-primary shadow-glow' : 'btn-outline'
                          }`}
                          onClick={() => setResultLayout('list')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        </button>
                        <button 
                          className={`btn btn-sm transform hover:scale-105 transition-transform ${
                            resultLayout === 'grid' ? 'btn-primary shadow-glow' : 'btn-outline'
                          }`}
                          onClick={() => setResultLayout('grid')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Filters */}
                      <div className="dropdown">
                        <label tabIndex={0} className="btn btn-sm btn-outline transform hover:scale-105 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                          Filters
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu p-4 shadow-2xl bg-base-100 rounded-box w-64 mt-2 border border-base-300">
                          <li className="menu-title"><span>Type</span></li>
                          <li>
                            <select 
                              className="select select-bordered select-sm w-full hover:select-primary transition-all"
                              value={filters.type}
                              onChange={(e) => setFilters({...filters, type: e.target.value})}
                            >
                              <option value="all">All Types</option>
                              <option value="article">Articles</option>
                              <option value="tutorial">Tutorials</option>
                              <option value="guide">Guides</option>
                              <option value="research">Research</option>
                            </select>
                          </li>
                          
                          <li className="menu-title mt-3"><span>Sort By</span></li>
                          <li>
                            <select 
                              className="select select-bordered select-sm w-full hover:select-primary transition-all"
                              value={filters.sortBy}
                              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                            >
                              <option value="relevance">Relevance</option>
                              <option value="date">Date</option>
                              <option value="popularity">Popularity</option>
                            </select>
                          </li>
                          
                          <li className="mt-4">
                            <button className="btn btn-sm btn-primary w-full transform hover:scale-105 transition-transform shadow-glow">
                              Apply Filters
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Results */}
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="card bg-base-100 border border-base-200 rounded-xl animate-pulse-slow">
                          <div className="card-body p-5">
                            <div className="h-5 bg-base-200 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-base-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-base-200 rounded w-5/6 mb-4"></div>
                            <div className="flex justify-between">
                              <div className="h-4 bg-base-200 rounded w-16"></div>
                              <div className="h-4 bg-base-200 rounded w-16"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={resultLayout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                      {sortedResults.map((result) => (
                        <ResultCard
                          key={result.id}
                          title={result.title}
                          url={result.url}
                          snippet={result.snippet}
                          score={result.score}
                          personalizedScore={result.personalized_score}
                          onFeedback={(feedbackType) => handleResultFeedback(result.id, feedbackType)}
                          feedbackGiven={result.feedbackGiven}
                          type={result.type}
                          tags={result.tags}
                          date={result.date}
                          author={result.author}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Pagination */}
                  <div className="flex justify-center mt-8">
                    <div className="join">
                      <button className="join-item btn btn-outline transform hover:scale-105 transition-transform">«</button>
                      <button className="join-item btn btn-outline transform hover:scale-105 transition-transform">1</button>
                      <button className="join-item btn btn-outline btn-active shadow-glow">2</button>
                      <button className="join-item btn btn-outline transform hover:scale-105 transition-transform">3</button>
                      <button className="join-item btn btn-outline transform hover:scale-105 transition-transform">»</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {activeView === 'dashboard' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold binary-gradient-text">Analytics Dashboard</h2>
                <p className="text-base-content/70">Track your search performance and insights</p>
              </div>
              
              <AnalyticsDashboard />
            </div>
          )}
          
          {activeView === 'history' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold binary-gradient-text">Search History</h2>
                <p className="text-base-content/70">Your recent searches and activity</p>
              </div>
              
              <div className="card bg-base-100 border border-base-200 shadow-xl">
                <div className="card-body">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Query</th>
                          <th>Date</th>
                          <th>Results</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.searchHistory.map((query, index) => (
                          <tr key={index} className="hover:bg-base-200 transition-all">
                            <td>
                              <div className="font-medium">{query}</div>
                            </td>
                            <td>2023-10-{15 - index}</td>
                            <td>{Math.floor(Math.random() * 100) + 10} results</td>
                            <td>
                              <button 
                                className="btn btn-xs btn-ghost transform hover:scale-110 transition-transform"
                                onClick={() => handleSearch(query)}
                              >
                                Search Again
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeView === 'settings' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold binary-gradient-text">Settings</h2>
                <p className="text-base-content/70">Customize your search experience</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="card bg-base-100 border border-base-200 shadow-xl">
                    <div className="card-body">
                      <ul className="menu bg-base-100 w-full">
                        <li><a className="active hover:bg-base-200 transition-all">General</a></li>
                        <li><a className="hover:bg-base-200 transition-all">Appearance</a></li>
                        <li><a className="hover:bg-base-200 transition-all">Privacy</a></li>
                        <li><a className="hover:bg-base-200 transition-all">Notifications</a></li>
                        <li><a className="hover:bg-base-200 transition-all">Advanced</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <div className="card bg-base-100 border border-base-200 shadow-xl">
                    <div className="card-body">
                      <h3 className="card-title binary-gradient-text">General Settings</h3>
                      
                      <div className="space-y-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Theme</span>
                          </label>
                          <select 
                            className="select select-bordered w-full max-w-xs hover:select-primary transition-all"
                            value={user.preferences.theme}
                            onChange={(e) => {
                              const newTheme = e.target.value as 'light' | 'dark' | 'genz';
                              setUser(prev => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  theme: newTheme
                                }
                              }));
                              document.documentElement.setAttribute('data-theme', newTheme);
                            }}
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="genz">Gen Z</option>
                          </select>
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Default Result Layout</span>
                          </label>
                          <div className="btn-group">
                            <button 
                              className={`btn transform hover:scale-105 transition-transform ${
                                user.preferences.resultLayout === 'list' ? 'btn-primary shadow-glow' : 'btn-outline'
                              }`}
                              onClick={() => setUser(prev => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  resultLayout: 'list'
                                }
                              }))}
                            >
                              List View
                            </button>
                            <button 
                              className={`btn transform hover:scale-105 transition-transform ${
                                user.preferences.resultLayout === 'grid' ? 'btn-primary shadow-glow' : 'btn-outline'
                              }`}
                              onClick={() => setUser(prev => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  resultLayout: 'grid'
                                }
                              }))}
                            >
                              Grid View
                            </button>
                          </div>
                        </div>
                        
                        <div className="form-control">
                          <label className="label cursor-pointer justify-between">
                            <span className="label-text">Enable Notifications</span>
                            <input 
                              type="checkbox" 
                              className="toggle toggle-primary"
                              checked={user.preferences.notifications}
                              onChange={(e) => setUser(prev => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  notifications: e.target.checked
                                }
                              }))}
                            />
                          </label>
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Search Language</span>
                          </label>
                          <select className="select select-bordered w-full max-w-xs hover:select-primary transition-all">
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                            <option>Chinese</option>
                          </select>
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Personalization Level</span>
                          </label>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            defaultValue="85" 
                            className="range range-primary" 
                          />
                          <div className="flex justify-between text-xs px-2">
                            <span>Basic</span>
                            <span>Standard</span>
                            <span>Advanced</span>
                          </div>
                        </div>
                        
                        <div className="divider"></div>
                        
                        <div className="flex justify-end gap-3">
                          <button className="btn btn-ghost transform hover:scale-105 transition-transform">Cancel</button>
                          <button className="btn btn-primary transform hover:scale-105 transition-transform shadow-glow">Save Changes</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;