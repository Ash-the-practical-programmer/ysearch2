import React, { useState } from 'react';

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  // Mock data for charts
  const searchTrendsData = [
    { date: '2023-09-01', searches: 45 },
    { date: '2023-09-05', searches: 62 },
    { date: '2023-09-10', searches: 58 },
    { date: '2023-09-15', searches: 78 },
    { date: '2023-09-20', searches: 85 },
    { date: '2023-09-25', searches: 92 },
    { date: '2023-09-30', searches: 88 },
  ];
  
  const agentPerformanceData = [
    { name: 'Search Agent', value: 95, color: 'bg-primary' },
    { name: 'Reasoning Agent', value: 87, color: 'bg-secondary' },
    { name: 'Personalization Agent', value: 92, color: 'bg-accent' },
    { name: 'Ranking Agent', value: 89, color: 'bg-neutral' },
  ];
  
  const topQueries = [
    { query: 'AI machine learning', percentage: 22, change: 5 },
    { query: 'web development', percentage: 18, change: -2 },
    { query: 'data science', percentage: 15, change: 3 },
    { query: 'cloud computing', percentage: 12, change: 1 },
    { query: 'cybersecurity', percentage: 10, change: -1 },
  ];
  
  const feedbackData = [
    { type: 'Positive', percentage: 75, color: 'bg-success', count: 150 },
    { type: 'Neutral', percentage: 15, color: 'bg-warning', count: 30 },
    { type: 'Negative', percentage: 10, color: 'bg-error', count: 20 },
  ];
  
  // Function to render a simple bar chart
  const renderBarChart = () => {
    const maxValue = Math.max(...searchTrendsData.map(d => d.searches));
    
    return (
      <div className="flex items-end h-48 gap-2 mt-4">
        {searchTrendsData.map((data, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="text-xs text-base-content/70 mb-1">{data.date.split('-')[2]}</div>
            <div 
              className="w-full bg-gradient-to-t from-primary to-primary-focus rounded-t-md transition-all hover:opacity-75 animate-float"
              style={{ height: `${(data.searches / maxValue) * 100}%` }}
            ></div>
            <div className="text-xs text-base-content/70 mt-1">{data.searches}</div>
          </div>
        ))}
      </div>
    );
  };
  
  // Function to render a pie chart
  const renderPieChart = () => {
    const total = feedbackData.reduce((sum, item) => sum + item.count, 0);
    let startAngle = 0;
    
    return (
      <div className="relative w-40 h-40 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-gradient">
          {feedbackData.map((item, index) => {
            const percentage = (item.count / total) * 100;
            const angle = (percentage / 100) * 360;
            const endAngle = startAngle + angle;
            
            // Convert angles to radians
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            
            // Calculate coordinates
            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);
            
            // Determine if it's a large arc
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            // Create path
            const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            startAngle = endAngle;
            
            return (
              <path 
                key={index}
                d={pathData}
                fill={`hsl(${item.color === 'bg-success' ? '120' : item.color === 'bg-warning' ? '60' : '0'}, 80%, 50%)`}
                stroke="white"
                strokeWidth="1"
                className="transition-all duration-300 hover:opacity-75"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold binary-gradient-text">{total}</div>
            <div className="text-xs text-base-content/70">Total</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Time Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold binary-gradient-text">Search Analytics</h2>
        <div className="btn-group">
          <button 
            className={`btn btn-sm transform hover:scale-105 transition-transform ${
              timeRange === '7d' ? 'btn-primary shadow-glow' : 'btn-outline'
            }`}
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </button>
          <button 
            className={`btn btn-sm transform hover:scale-105 transition-transform ${
              timeRange === '30d' ? 'btn-primary shadow-glow' : 'btn-outline'
            }`}
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </button>
          <button 
            className={`btn btn-sm transform hover:scale-105 transition-transform ${
              timeRange === '90d' ? 'btn-primary shadow-glow' : 'btn-outline'
            }`}
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="card-title text-sm font-normal">Total Searches</h3>
                <p className="text-3xl font-bold mt-2">1,248</p>
              </div>
              <div className="badge badge-ghost animate-pulse">↑ 12%</div>
            </div>
            <div className="stat-desc mt-2">from last period</div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-secondary to-secondary-focus text-secondary-content shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="card-title text-sm font-normal">Avg. Response Time</h3>
                <p className="text-3xl font-bold mt-2">0.8s</p>
              </div>
              <div className="badge badge-ghost animate-pulse">↓ 0.2s</div>
            </div>
            <div className="stat-desc mt-2">from last period</div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-accent to-accent-focus text-accent-content shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="card-title text-sm font-normal">Personalization Rate</h3>
                <p className="text-3xl font-bold mt-2">87%</p>
              </div>
              <div className="badge badge-ghost animate-pulse">↑ 5%</div>
            </div>
            <div className="stat-desc mt-2">from last period</div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-neutral to-neutral-focus text-neutral-content shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="card-title text-sm font-normal">User Satisfaction</h3>
                <p className="text-3xl font-bold mt-2">92%</p>
              </div>
              <div className="badge badge-ghost animate-pulse">↑ 3%</div>
            </div>
            <div className="stat-desc mt-2">from last period</div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Search Trends */}
        <div className="card bg-base-100 shadow-xl lg:col-span-2 border border-base-200 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title binary-gradient-text">Search Trends</h3>
              <div className="btn-group">
                <button className="btn btn-xs btn-outline btn-active transform hover:scale-105 transition-transform">Week</button>
                <button className="btn btn-xs btn-outline transform hover:scale-105 transition-transform">Month</button>
                <button className="btn btn-xs btn-outline transform hover:scale-105 transition-transform">Year</button>
              </div>
            </div>
            {renderBarChart()}
          </div>
        </div>
        
        {/* Agent Performance */}
        <div className="card bg-base-100 shadow-xl border border-base-200 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="card-body">
            <h3 className="card-title binary-gradient-text">Agent Performance</h3>
            <div className="space-y-4 mt-4">
              {agentPerformanceData.map((agent, index) => (
                <div key={index} className="transform hover:scale-105 transition-transform duration-300">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{agent.name}</span>
                    <span className="text-sm font-medium">{agent.value}%</span>
                  </div>
                  <div className="w-full bg-base-200 rounded-full h-2.5">
                    <div 
                      className={`${agent.color} h-2.5 rounded-full transition-all duration-500 animate-gradient`}
                      style={{ width: `${agent.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Queries */}
        <div className="card bg-base-100 shadow-xl border border-base-200 lg:col-span-2 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="card-body">
            <h3 className="card-title binary-gradient-text">Top Queries</h3>
            <div className="space-y-3">
              {topQueries.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-base-200 last:border-0 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center">
                    <div className="w-8 text-center text-sm font-medium text-base-content/60">#{index + 1}</div>
                    <span className="font-medium">{item.query}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">{item.percentage}%</span>
                    <div className={`badge badge-xs ${item.change >= 0 ? 'badge-success animate-pulse' : 'badge-error animate-pulse'}`}>
                      {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* User Feedback */}
        <div className="card bg-base-100 shadow-xl border border-base-200 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="card-body">
            <h3 className="card-title binary-gradient-text">User Feedback</h3>
            <div className="flex flex-col items-center">
              {renderPieChart()}
              <div className="w-full mt-6 space-y-3">
                {feedbackData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} mr-2 animate-pulse`}></div>
                      <span>{item.type}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 bg-base-200 rounded-full h-1.5 mr-2">
                        <div 
                          className={`${item.color} h-1.5 rounded-full animate-gradient`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-10 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;