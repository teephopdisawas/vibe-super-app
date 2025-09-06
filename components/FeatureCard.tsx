import React from 'react';

interface FeatureCardProps {
  title: string;
  children: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, children }) => {
  return (
    <div className="bg-base-100 dark:bg-dark-100 p-6 rounded-lg shadow-xl border border-base-300 dark:border-dark-300">
      <h3 className="text-lg font-semibold text-base-content dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default FeatureCard;
