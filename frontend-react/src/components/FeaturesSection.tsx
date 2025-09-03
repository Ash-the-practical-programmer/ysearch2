import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "AI-Powered",
      description: "Intelligent agents process your queries using advanced NLP and reasoning capabilities.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "primary",
      bgColor: "bg-primary",
      textColor: "text-primary-content"
    },
    {
      title: "Personalized",
      description: "Results tailored to your preferences and search history for a unique experience.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: "secondary",
      bgColor: "bg-secondary",
      textColor: "text-secondary-content"
    },
    {
      title: "Continuously Learning",
      description: "System improves over time based on your feedback and interactions.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      color: "accent",
      bgColor: "bg-accent",
      textColor: "text-accent-content"
    }
  ];

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-center mb-8">Why Choose YSearch2?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                <div className={`${feature.bgColor} ${feature.textColor} p-2 rounded-full`}>
                  {feature.icon}
                </div>
                {feature.title}
              </h2>
              <p>{feature.description}</p>
              <div className="card-actions justify-end">
                <button className={`btn btn-${feature.color} btn-sm`}>Learn more</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;