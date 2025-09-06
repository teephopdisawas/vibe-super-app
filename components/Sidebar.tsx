import React from 'react';
import { Feature } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  activeFeature: Feature;
  setActiveFeature: (feature: Feature) => void;
}

const NavItem: React.FC<{
  feature: Feature;
  activeFeature: Feature;
  setActiveFeature: (feature: Feature) => void;
  icon: JSX.Element;
  label: string;
}> = ({ feature, activeFeature, setActiveFeature, icon, label }) => {
  const isActive = activeFeature === feature;
  return (
    <button
      onClick={() => setActiveFeature(feature)}
      className={`flex items-center w-full px-4 py-3 transition-colors duration-200 rounded-lg ${
        isActive
          ? 'bg-brand-secondary text-white shadow-lg'
          : 'text-base-content hover:bg-base-200 dark:text-dark-content dark:hover:bg-dark-300 dark:hover:text-white'
      }`}
    >
      {React.cloneElement(icon, { className: 'h-6 w-6 mr-4' })}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ activeFeature, setActiveFeature }) => {
  return (
    <aside className="w-64 bg-base-100 dark:bg-dark-100 p-4 border-r border-base-300 dark:border-dark-300 flex flex-col">
      <div className="flex items-center mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-secondary mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.59L6.41 12 5 13.41 11 19.41 21.59 8.83 20.17 7.41 11 16.59z"/>
        </svg>
        <h2 className="text-2xl font-bold text-base-content dark:text-white">Super App</h2>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem 
          feature={Feature.StoryWeaver} 
          activeFeature={activeFeature} 
          setActiveFeature={setActiveFeature}
          label="Story Weaver"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>}
        />
        <NavItem 
          feature={Feature.ImageSpark} 
          activeFeature={activeFeature} 
          setActiveFeature={setActiveFeature}
          label="Image Spark"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>}
        />
        <NavItem 
          feature={Feature.CodeCompanion} 
          activeFeature={activeFeature} 
          setActiveFeature={setActiveFeature}
          label="Code Companion"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>}
        />
        <NavItem 
          feature={Feature.TravelPlanner} 
          activeFeature={activeFeature} 
          setActiveFeature={setActiveFeature}
          label="Travel Planner"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177.177a2.25 2.25 0 00-.177 3.183l2.401 2.402a1.125 1.125 0 001.59 0l2.402-2.402a2.25 2.25 0 00-3.182-3.182l-1.739-1.74a2.25 2.25 0 00-3.182 0z" /></svg>}
        />
        <NavItem 
          feature={Feature.KnowledgeSeeker} 
          activeFeature={activeFeature} 
          setActiveFeature={setActiveFeature}
          label="Knowledge Seeker"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>}
        />
      </nav>
      <div className="mt-auto flex justify-center p-2">
        <ThemeToggle />
      </div>
    </aside>
  );
};