import React, { useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import Button from '../components/Button';
import { generateStoryStream } from '../services/geminiService';

const StoryWeaver: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setStory('');
    setError(null);
    try {
      const stream = await generateStoryStream(prompt);
      for await (const chunk of stream) {
        setStory((prev) => prev + chunk.text);
      }
    } catch (e) {
      setError('Failed to generate story. Please check your API key and try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FeatureCard title="Enter a prompt">
        <div className="flex flex-col space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., a lost robot in a magical forest"
            className="w-full p-3 bg-base-200 dark:bg-dark-200 border border-base-300 dark:border-dark-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition text-base-content dark:text-dark-content"
            rows={3}
          />
          <div className="self-end">
            <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt}>
              Weave Story
            </Button>
          </div>
        </div>
      </FeatureCard>
      
      {(isLoading || story || error) && (
        <FeatureCard title="Your Generated Story">
          {error && <p className="text-red-400">{error}</p>}
          {story && <p className="whitespace-pre-wrap leading-relaxed">{story}</p>}
          {isLoading && !story && <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-brand-secondary"></div></div>}
        </FeatureCard>
      )}
    </div>
  );
};

export default StoryWeaver;
