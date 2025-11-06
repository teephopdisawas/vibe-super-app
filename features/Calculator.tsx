import { useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import Button from '../components/Button';
import { solveMathProblem } from '../services/geminiService';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [mathProblem, setMathProblem] = useState('');
  const [aiSolution, setAiSolution] = useState('');
  const [isSolving, setIsSolving] = useState(false);
  const [error, setError] = useState('');

  const handleNumberClick = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimalClick = () => {
    if (shouldResetDisplay) {
      setDisplay('0.');
      setShouldResetDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperationClick = (op: string) => {
    const currentValue = parseFloat(display);

    if (previousValue !== null && operation && !shouldResetDisplay) {
      const result = calculateResult();
      setDisplay(result.toString());
      setPreviousValue(result);
    } else {
      setPreviousValue(currentValue);
    }

    setOperation(op);
    setShouldResetDisplay(true);
  };

  const calculateResult = (): number => {
    const current = parseFloat(display);
    const previous = previousValue ?? 0;

    switch (operation) {
      case '+': return previous + current;
      case '-': return previous - current;
      case '×': return previous * current;
      case '÷': return previous / current;
      case '%': return previous % current;
      case '^': return Math.pow(previous, current);
      default: return current;
    }
  };

  const handleEqualsClick = () => {
    if (operation && previousValue !== null) {
      const result = calculateResult();
      const calculation = `${previousValue} ${operation} ${display} = ${result}`;
      setHistory([calculation, ...history.slice(0, 9)]);
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleFunction = (func: string) => {
    const value = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sqrt': result = Math.sqrt(value); break;
      case 'sin': result = Math.sin(value); break;
      case 'cos': result = Math.cos(value); break;
      case 'tan': result = Math.tan(value); break;
      case 'ln': result = Math.log(value); break;
      case 'log': result = Math.log10(value); break;
      case '1/x': result = 1 / value; break;
      case 'x²': result = value * value; break;
      default: result = value;
    }

    setDisplay(result.toString());
    setShouldResetDisplay(true);
  };

  const handleAISolve = async () => {
    if (!mathProblem.trim()) {
      setError('Please enter a math problem');
      return;
    }

    setIsSolving(true);
    setError('');
    setAiSolution('');
    try {
      let solution = '';
      for await (const chunk of solveMathProblem(mathProblem)) {
        solution += chunk;
        setAiSolution(solution);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to solve problem');
    } finally {
      setIsSolving(false);
    }
  };

  const buttonClass = "w-full h-14 text-lg font-semibold rounded-lg transition-colors";
  const numberButtonClass = `${buttonClass} bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600`;
  const operationButtonClass = `${buttonClass} bg-blue-500 hover:bg-blue-600 text-white`;
  const functionButtonClass = `${buttonClass} bg-purple-500 hover:bg-purple-600 text-white text-sm`;

  return (
    <div className="space-y-6">
      <FeatureCard title="Calculator" description="Advanced calculator with AI-powered math problem solver">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Standard Calculator */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Standard Calculator</h3>

            {/* Display */}
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-right text-sm text-gray-500 dark:text-gray-400 h-6">
                {operation && previousValue !== null ? `${previousValue} ${operation}` : ''}
              </div>
              <div className="text-right text-3xl font-bold break-all">{display}</div>
            </div>

            {/* Scientific Functions */}
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => handleFunction('sin')} className={functionButtonClass}>sin</button>
              <button onClick={() => handleFunction('cos')} className={functionButtonClass}>cos</button>
              <button onClick={() => handleFunction('tan')} className={functionButtonClass}>tan</button>
              <button onClick={() => handleFunction('sqrt')} className={functionButtonClass}>√</button>
              <button onClick={() => handleFunction('ln')} className={functionButtonClass}>ln</button>
              <button onClick={() => handleFunction('log')} className={functionButtonClass}>log</button>
              <button onClick={() => handleFunction('x²')} className={functionButtonClass}>x²</button>
              <button onClick={() => handleFunction('1/x')} className={functionButtonClass}>1/x</button>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-4 gap-2">
              <button onClick={handleClear} className={`${buttonClass} bg-red-500 hover:bg-red-600 text-white`}>C</button>
              <button onClick={handleBackspace} className={operationButtonClass}>⌫</button>
              <button onClick={() => handleOperationClick('%')} className={operationButtonClass}>%</button>
              <button onClick={() => handleOperationClick('÷')} className={operationButtonClass}>÷</button>

              <button onClick={() => handleNumberClick('7')} className={numberButtonClass}>7</button>
              <button onClick={() => handleNumberClick('8')} className={numberButtonClass}>8</button>
              <button onClick={() => handleNumberClick('9')} className={numberButtonClass}>9</button>
              <button onClick={() => handleOperationClick('×')} className={operationButtonClass}>×</button>

              <button onClick={() => handleNumberClick('4')} className={numberButtonClass}>4</button>
              <button onClick={() => handleNumberClick('5')} className={numberButtonClass}>5</button>
              <button onClick={() => handleNumberClick('6')} className={numberButtonClass}>6</button>
              <button onClick={() => handleOperationClick('-')} className={operationButtonClass}>-</button>

              <button onClick={() => handleNumberClick('1')} className={numberButtonClass}>1</button>
              <button onClick={() => handleNumberClick('2')} className={numberButtonClass}>2</button>
              <button onClick={() => handleNumberClick('3')} className={numberButtonClass}>3</button>
              <button onClick={() => handleOperationClick('+')} className={operationButtonClass}>+</button>

              <button onClick={() => handleNumberClick('0')} className={`${numberButtonClass} col-span-2`}>0</button>
              <button onClick={handleDecimalClick} className={numberButtonClass}>.</button>
              <button onClick={handleEqualsClick} className={`${buttonClass} bg-green-500 hover:bg-green-600 text-white`}>=</button>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h4 className="text-sm font-semibold mb-2">History</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {history.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Math Solver */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">AI Math Solver</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Enter your math problem</label>
                <textarea
                  value={mathProblem}
                  onChange={(e) => setMathProblem(e.target.value)}
                  placeholder="Example: Solve the quadratic equation x² + 5x + 6 = 0"
                  className="w-full h-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button onClick={handleAISolve} disabled={isSolving} className="w-full">
                {isSolving ? 'Solving...' : 'Solve with AI'}
              </Button>

              {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {aiSolution && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-800 dark:text-green-300">Solution:</h4>
                  <div className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">{aiSolution}</div>
                </div>
              )}

              {/* Example Problems */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="text-sm font-semibold mb-2 text-blue-800 dark:text-blue-300">Example Problems:</h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Solve: 2x + 5 = 15</li>
                  <li>• Find derivative of x³ + 2x² - 5x + 1</li>
                  <li>• Calculate integral of sin(x) from 0 to π</li>
                  <li>• Solve quadratic: x² - 7x + 12 = 0</li>
                  <li>• Convert 50 miles to kilometers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </FeatureCard>
    </div>
  );
}
