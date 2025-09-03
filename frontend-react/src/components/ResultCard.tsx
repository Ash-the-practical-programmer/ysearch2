import React, { useState } from 'react';

interface ResultCardProps {
  title: string;
  url: string;
  snippet: string;
  score: number;
  personalizedScore?: number;
  onFeedback: (feedbackType: string) => void;
  feedbackGiven?: string;
  type?: string;
  tags?: string[];
  date?: string;
  author?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  url, 
  snippet, 
  score, 
  personalizedScore, 
  onFeedback, 
  feedbackGiven,
  type = 'article',
  tags = [],
  date,
  author
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get domain from URL
  const domain = new URL(url).hostname;

  // Get favicon
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return (
    <div 
      className="card bg-base-100 border border-base-200 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-body p-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-2">
              <div className="avatar mr-2">
                <div className="w-5 rounded">
                  <img src={faviconUrl} alt={`${domain} favicon`} onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ccc"/></svg>';
                  }} />
                </div>
              </div>
              <div className="text-sm text-base-content/70 truncate">{domain}</div>
              {type && (
                <div className="badge badge-xs badge-primary ml-2 animate-pulse">{type}</div>
              )}
            </div>
            
            <h3 className="card-title text-lg m-0 leading-tight">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="link link-primary hover:link-secondary transition-all duration-300"
              >
                {title}
              </a>
            </h3>
          </div>
          
          <button 
            className="btn btn-sm btn-ghost ml-2 transform hover:scale-110 transition-transform"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="mt-3">
          <p className={`text-base-content transition-all duration-300 ${expanded ? '' : 'line-clamp-2'}`}>
            {snippet}
          </p>
          
          {/* Expanded content */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-base-200 space-y-3">
              {/* Preview button */}
              <div>
                <button 
                  className="btn btn-xs btn-outline transform hover:scale-105 transition-transform"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
                
                {showPreview && (
                  <div className="mt-3 p-3 bg-base-200 rounded-lg shimmer-bg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="skeleton w-8 h-8 rounded-full"></div>
                      <div>
                        <div className="skeleton h-3 w-24"></div>
                        <div className="skeleton h-2 w-16 mt-1"></div>
                      </div>
                    </div>
                    <div className="skeleton h-32 w-full rounded"></div>
                  </div>
                )}
              </div>
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-2">
                {date && (
                  <div className="text-xs text-base-content/70 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {date}
                  </div>
                )}
                
                {author && (
                  <div className="text-xs text-base-content/70 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {author}
                  </div>
                )}
              </div>
              
              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <div key={index} className="badge badge-xs badge-outline animate-fadeIn">
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-base-200">
          <div className="flex items-center space-x-2">
            <div className="tooltip tooltip-top" data-tip="Relevance Score">
              <div className="badge badge-xs badge-outline transform hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {score.toFixed(2)}
              </div>
            </div>
            
            {personalizedScore && (
              <div className="tooltip tooltip-top" data-tip="Personalized Score">
                <div className="badge badge-xs badge-primary transform hover:scale-110 transition-transform animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {personalizedScore.toFixed(2)}
                </div>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-1">
            <div className="tooltip tooltip-top" data-tip="Save for later">
              <button className="btn btn-xs btn-ghost btn-circle transform hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
            
            <div className="tooltip tooltip-top" data-tip="Share">
              <button className="btn btn-xs btn-ghost btn-circle transform hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
            
            <div className="divider divider-horizontal mx-1"></div>
            
            <div className="tooltip tooltip-top" data-tip="Like this result">
              <button
                onClick={() => onFeedback('like')}
                className={`btn btn-xs ${feedbackGiven === 'like' ? 'btn-success' : 'btn-ghost'} btn-circle transform hover:scale-110 transition-transform`}
                aria-label="Like"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </button>
            </div>
            
            <div className="tooltip tooltip-top" data-tip="Dislike this result">
              <button
                onClick={() => onFeedback('dislike')}
                className={`btn btn-xs ${feedbackGiven === 'dislike' ? 'btn-error' : 'btn-ghost'} btn-circle transform hover:scale-110 transition-transform`}
                aria-label="Dislike"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2.765a2 2 0 011.789 2.894l-3.5 7A2 2 0 0118.264 15H17m0 0v5m0-5h-2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;