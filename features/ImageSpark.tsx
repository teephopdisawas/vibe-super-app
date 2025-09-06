import React, { useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import Button from '../components/Button';
import { generateImage } from '../services/geminiService';
import { LoadingSpinner } from '../components/LoadingSpinner';

const ImageSpark: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setImageUrl(null);
    setError(null);
    try {
      const url = await generateImage(prompt, aspectRatio);
      setImageUrl(url);
    } catch (e) {
      setError('Failed to generate image. Please check your API key and try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

  return (
    <div className="space-y-6">
      <FeatureCard title="Describe an image">
        <div className="flex flex-col space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., a photorealistic image of a cat wearing a wizard hat"
            className="w-full p-3 bg-base-200 dark:bg-dark-200 border border-base-300 dark:border-dark-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition text-base-content dark:text-dark-content"
            rows={3}
          />
           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
             <div>
                <label className="text-sm font-medium text-base-content dark:text-dark-content mr-2">Aspect Ratio:</label>
                <select 
                    value={aspectRatio} 
                    onChange={e => setAspectRatio(e.target.value)}
                    className="bg-base-200 dark:bg-dark-200 border border-base-300 dark:border-dark-300 rounded-md p-2 focus:ring-2 focus:ring-brand-secondary focus:outline-none text-base-content dark:text-dark-content"
                >
                    {aspectRatios.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                </select>
            </div>
            <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt}>
              Spark Image
            </Button>
           </div>
        </div>
      </FeatureCard>

      {(isLoading || imageUrl || error) && (
        <FeatureCard title="Generated Image">
          {error && <p className="text-red-400">{error}</p>}
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-8 bg-base-200 dark:bg-dark-200 rounded-lg">
              <LoadingSpinner className="h-12 w-12"/>
              <p className="mt-4 text-base-content dark:text-dark-content">Generating your masterpiece...</p>
            </div>
          )}
          {imageUrl && (
            <div className="flex justify-center">
              <img src={imageUrl} alt={prompt} className="rounded-lg shadow-lg max-w-full h-auto" />
            </div>
          )}
        </FeatureCard>
      )}
    </div>
  );
};

export default ImageSpark;
