import { useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import Button from '../components/Button';
import { improveText, summarizeText, rewriteText } from '../services/geminiService';

export default function WordProcessor() {
  const [document, setDocument] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [error, setError] = useState('');

  const wordCount = document.trim() ? document.trim().split(/\s+/).length : 0;
  const charCount = document.length;

  const handleTextSelection = () => {
    const textarea = window.getSelection()?.toString();
    if (textarea) {
      setSelectedText(textarea);
    }
  };

  const handleImprove = async () => {
    const textToImprove = selectedText || document;
    if (!textToImprove.trim()) return;

    setIsProcessing(true);
    setError('');
    try {
      let improvedText = '';
      for await (const chunk of improveText(textToImprove)) {
        improvedText += chunk;
      }

      if (selectedText) {
        setDocument(document.replace(selectedText, improvedText));
        setSelectedText('');
      } else {
        setDocument(improvedText);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to improve text');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSummarize = async () => {
    const textToSummarize = selectedText || document;
    if (!textToSummarize.trim()) return;

    setIsProcessing(true);
    setError('');
    try {
      let summary = '';
      for await (const chunk of summarizeText(textToSummarize)) {
        summary += chunk;
      }

      if (selectedText) {
        setDocument(document.replace(selectedText, summary));
        setSelectedText('');
      } else {
        setDocument(summary);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to summarize text');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRewrite = async () => {
    const textToRewrite = selectedText || document;
    if (!textToRewrite.trim()) return;

    setIsProcessing(true);
    setError('');
    try {
      let rewritten = '';
      for await (const chunk of rewriteText(textToRewrite)) {
        rewritten += chunk;
      }

      if (selectedText) {
        setDocument(document.replace(selectedText, rewritten));
        setSelectedText('');
      } else {
        setDocument(rewritten);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rewrite text');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([document], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = 'document.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <FeatureCard title="Word Processor" description="Create and edit documents with AI-powered writing assistance">
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Button
              onClick={handleImprove}
              disabled={isProcessing || !document.trim()}
              className="text-sm"
            >
              {isProcessing ? 'Processing...' : 'Improve Text'}
            </Button>
            <Button
              onClick={handleSummarize}
              disabled={isProcessing || !document.trim()}
              className="text-sm"
            >
              Summarize
            </Button>
            <Button
              onClick={handleRewrite}
              disabled={isProcessing || !document.trim()}
              className="text-sm"
            >
              Rewrite
            </Button>
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm">Font Size:</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
                <option value={20}>20px</option>
              </select>
              <Button
                onClick={handleDownload}
                disabled={!document.trim()}
                className="text-sm"
              >
                Download
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {/* Editor */}
          <textarea
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            onMouseUp={handleTextSelection}
            placeholder="Start typing your document here..."
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ fontSize: `${fontSize}px` }}
          />

          {/* Status Bar */}
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span>Words: {wordCount}</span>
            <span>Characters: {charCount}</span>
            {selectedText && <span className="text-blue-600 dark:text-blue-400">Selected: {selectedText.length} chars</span>}
          </div>
        </div>
      </FeatureCard>
    </div>
  );
}
