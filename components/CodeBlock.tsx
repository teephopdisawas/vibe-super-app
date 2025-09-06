import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formattedCode = code.replace(/```(.*\n)?/g, '').trim();

  return (
    <div className="bg-base-200 dark:bg-dark-100 rounded-lg overflow-hidden relative border border-base-300 dark:border-dark-300">
      <div className="bg-base-300 dark:bg-dark-300 px-4 py-2 flex justify-between items-center">
        <span className="text-xs font-sans text-gray-500 dark:text-gray-400">Generated Code</span>
        <button
          onClick={handleCopy}
          className="text-xs bg-base-100 text-gray-600 hover:bg-base-200 px-2 py-1 rounded dark:bg-dark-100 dark:text-gray-300 dark:hover:bg-dark-200"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="font-mono text-base-content dark:text-white">{formattedCode}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
