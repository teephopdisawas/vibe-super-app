import React, { useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import Button from '../components/Button';
import { searchWithGoogle } from '../services/geminiService';
import type { GroundingChunk } from '../types';

const KnowledgeSeeker: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<{ text: string; sources: GroundingChunk[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await searchWithGoogle(prompt);
      setResult(response);
    } catch (e) {
      setError('An error occurred during the search. Please check your API key and try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FeatureCard title="Ask anything...">
        <div className="flex flex-col space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a question about recent events or up-to-date information..."
            className="w-full p-3 bg-base-200 dark:bg-dark-200 border border-base-300 dark:border-dark-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition text-base-content dark:text-dark-content"
            rows={3}
          />
          <div className="self-end">
            <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt}>
              Seek Answer
            </Button>
          </div>
        </div>
      </FeatureCard>

      {(isLoading || result || error) && (
        <FeatureCard title="Grounded Answer">
          {error && <p className="text-red-400">{error}</p>}
          {isLoading && <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-brand-secondary"></div></div>}
          {result && (
            <div className="space-y-4">
              <p className="whitespace-pre-wrap leading-relaxed">{result.text}</p>
              {result.sources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-brand-secondary mt-6 mb-2">Sources:</h4>
                  <ul className="space-y-2">
                    {result.sources.map((source, index) => (
                      <li key={index} className="truncate">
                        <a
                          href={source.web.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                           [{index + 1}] {source.web.title || source.web.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </FeatureCard>
      )}
    </div>
  );
};

export default KnowledgeSeeker;
