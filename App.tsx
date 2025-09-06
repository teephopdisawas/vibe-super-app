import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Feature } from './types';
import StoryWeaver from './features/StoryWeaver';
import ImageSpark from './features/ImageSpark';
import CodeCompanion from './features/CodeCompanion';
import TravelPlanner from './features/TravelPlanner';
import KnowledgeSeeker from './features/KnowledgeSeeker';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.StoryWeaver);

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case Feature.StoryWeaver:
        return <StoryWeaver />;
      case Feature.ImageSpark:
        return <ImageSpark />;
      case Feature.CodeCompanion:
        return <CodeCompanion />;
      case Feature.TravelPlanner:
        return <TravelPlanner />;
      case Feature.KnowledgeSeeker:
        return <KnowledgeSeeker />;
      default:
        return <div className="text-base-content dark:text-dark-content">Select a feature</div>;
    }
  };

  const featureName = useMemo(() => {
    return Object.keys(Feature).find(key => Feature[key as keyof typeof Feature] === activeFeature)?.replace(/([A-Z])/g, ' $1').trim() || 'Super App';
  }, [activeFeature]);

  return (
    <div className="flex h-screen bg-base-200 text-base-content dark:bg-dark-200 dark:text-dark-content font-sans">
      <Sidebar activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-base-100/80 dark:bg-dark-300/80 backdrop-blur-sm border-b border-base-300 dark:border-dark-300 p-4 shadow-md z-10">
          <h1 className="text-xl font-bold text-base-content dark:text-white">{featureName}</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderActiveFeature()}
        </div>
      </main>
    </div>
  );
};

export default App;
