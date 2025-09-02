import React from 'react';

const AnalyticsDashboard: React.FC = () => {
  return (
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
  );
};

export default AnalyticsDashboard;