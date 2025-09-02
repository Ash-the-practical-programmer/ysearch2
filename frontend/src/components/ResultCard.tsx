import React from 'react';

interface ResultCardProps {
  title: string;
  url: string;
  snippet: string;
  score: number;
  personalizedScore?: number;
  onFeedback: (feedbackType: string) => void;
  feedbackGiven?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  url, 
  snippet, 
  score, 
  personalizedScore, 
  onFeedback, 
  feedbackGiven 
}) => {
  return (
    <div className="card bg-base-200 shadow-lg result-card">
      <div className="card-body p-6">
        <h3 className="card-title text-xl">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="link link-primary hover:link-secondary"
          >
            {title}
          </a>
        </h3>
        <p className="text-base-content/80">{snippet}</p>
        
        <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-base-300">
          <div className="flex items-center space-x-4">
            <span className="badge badge-outline">
              Score: {score.toFixed(2)}
            </span>
            {personalizedScore && (
              <span className="badge badge-primary">
                Personalized: {personalizedScore.toFixed(2)}
              </span>
            )}
            <div className="text-sm text-base-content/60">
              {new URL(url).hostname}
            </div>
          </div>
          
          {/* Feedback buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => onFeedback('like')}
              className={`btn btn-sm ${feedbackGiven === 'like' ? 'btn-success' : 'btn-ghost'}`}
              title="Like this result"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {feedbackGiven === 'like' && ' Liked'}
            </button>
            <button
              onClick={() => onFeedback('dislike')}
              className={`btn btn-sm ${feedbackGiven === 'dislike' ? 'btn-error' : 'btn-ghost'}`}
              title="Dislike this result"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2.765a2 2 0 011.789 2.894l-3.5 7A2 2 0 0118.264 15H17m0 0v5m0-5h-2" />
              </svg>
              {feedbackGiven === 'dislike' && ' Disliked'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;