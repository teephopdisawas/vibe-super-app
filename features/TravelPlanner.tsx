import React, { useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import Button from '../components/Button';
import { generateTravelItinerary } from '../services/geminiService';
import type { Itinerary } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

const TravelPlanner: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('5');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!destination || !duration) return;
    setIsLoading(true);
    setItinerary(null);
    setError(null);
    try {
      const response = await generateTravelItinerary(destination, duration);
      setItinerary(response);
    } catch (e) {
      setError('Failed to generate itinerary. The model may have returned an invalid format. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FeatureCard title="Plan Your Next Adventure">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination (e.g., Paris, France)"
            className="w-full p-3 bg-base-200 dark:bg-dark-200 border border-base-300 dark:border-dark-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition md:col-span-2 text-base-content dark:text-dark-content"
          />
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (days)"
            min="1"
            className="w-full p-3 bg-base-200 dark:bg-dark-200 border border-base-300 dark:border-dark-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition text-base-content dark:text-dark-content"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleGenerate} isLoading={isLoading} disabled={!destination || !duration}>
            Create Itinerary
          </Button>
        </div>
      </FeatureCard>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8">
            <LoadingSpinner className="h-12 w-12" />
            <p className="mt-4 text-base-content dark:text-dark-content">Crafting your perfect trip...</p>
        </div>
      )}

      {error && <FeatureCard title="Error"><p className="text-red-400">{error}</p></FeatureCard>}

      {itinerary && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-base-content dark:text-white">{itinerary.trip_title}</h2>
          {itinerary.days.map((day) => (
            <FeatureCard key={day.day} title={`Day ${day.day}: ${day.title}`}>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-brand-secondary mb-2">Activities:</h4>
                  <ul className="list-disc list-inside space-y-1 text-base-content dark:text-dark-content">
                    {day.activities.map((activity, index) => <li key={index}>{activity}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-secondary mb-2">Food Suggestions:</h4>
                  <p className="text-base-content dark:text-dark-content">{day.food_suggestions}</p>
                </div>
              </div>
            </FeatureCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelPlanner;
