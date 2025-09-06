import React, { useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import Button from '../components/Button';
import { runCodeCompanion } from '../services/geminiService';
import CodeBlock from '../components/CodeBlock';

const CodeCompanion: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setResult('');
    setError(null);
    try {
      const response = await runCodeCompanion(prompt);
      setResult(response);
    } catch (e) {
      setError('An error occurred. Please check your API key and try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const isCode = result.includes('```');

  return (
    <div className="space-y-6">
      <FeatureCard title="Ask a coding question">
        <div className="flex flex-col space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Generate a React component for a login form using TypeScript and Tailwind CSS' or 'Explain this code: [paste code here]'"
            className="w-full p-3 bg-base-200 dark:bg-dark-200 border border-base-300 dark:border-dark-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition font-mono text-sm text-base-content dark:text-dark-content"
            rows={6}
          />
          <div className="self-end">
            <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt}>
              Get Assistance
            </Button>
          </div>
        </div>
      </FeatureCard>
      
      {(isLoading || result || error) && (
        <FeatureCard title="Response">
          {error && <p className="text-red-400">{error}</p>}
          {isLoading && <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-brand-secondary"></div></div>}
          {result && (isCode ? <CodeBlock code={result} /> : <p className="whitespace-pre-wrap">{result}</p>)}
        </FeatureCard>
      )}
    </div>
  );
};

export default CodeCompanion;
