import { useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import Button from '../components/Button';
import { analyzeSpreadsheetData } from '../services/geminiService';

type CellData = { [key: string]: string };

export default function Spreadsheet() {
  const rows = 15;
  const cols = 10;
  const [cells, setCells] = useState<CellData>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const getColumnLabel = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C, etc.
  };

  const getCellKey = (row: number, col: number): string => {
    return `${getColumnLabel(col)}${row + 1}`;
  };

  const evaluateFormula = (formula: string, cellKey: string): string => {
    try {
      if (!formula.startsWith('=')) return formula;

      const expression = formula.substring(1);

      // Handle SUM(A1:A5)
      const sumMatch = expression.match(/SUM\(([A-Z]\d+):([A-Z]\d+)\)/i);
      if (sumMatch) {
        const [, start, end] = sumMatch;
        const values = getRangeValues(start, end);
        const sum = values.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
        return sum.toString();
      }

      // Handle AVERAGE(A1:A5)
      const avgMatch = expression.match(/AVERAGE\(([A-Z]\d+):([A-Z]\d+)\)/i);
      if (avgMatch) {
        const [, start, end] = avgMatch;
        const values = getRangeValues(start, end);
        const numValues = values.filter(v => !isNaN(parseFloat(v)));
        const avg = numValues.reduce((acc, val) => acc + parseFloat(val), 0) / (numValues.length || 1);
        return avg.toString();
      }

      // Handle simple cell references like =A1+B2
      const cellRefRegex = /[A-Z]\d+/g;
      let evalExpression = expression;
      const matches = expression.match(cellRefRegex);
      if (matches) {
        matches.forEach(ref => {
          const value = cells[ref] || '0';
          const numValue = parseFloat(value) || 0;
          evalExpression = evalExpression.replace(ref, numValue.toString());
        });
      }

      // Evaluate the expression
      const result = Function(`"use strict"; return (${evalExpression})`)();
      return result.toString();
    } catch (err) {
      return '#ERROR';
    }
  };

  const getRangeValues = (start: string, end: string): string[] => {
    const startCol = start.charCodeAt(0) - 65;
    const startRow = parseInt(start.substring(1)) - 1;
    const endCol = end.charCodeAt(0) - 65;
    const endRow = parseInt(end.substring(1)) - 1;

    const values: string[] = [];
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const key = getCellKey(r, c);
        values.push(cells[key] || '0');
      }
    }
    return values;
  };

  const getCellValue = (cellKey: string): string => {
    const value = cells[cellKey] || '';
    if (value.startsWith('=')) {
      return evaluateFormula(value, cellKey);
    }
    return value;
  };

  const handleCellChange = (cellKey: string, value: string) => {
    setCells({ ...cells, [cellKey]: value });
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError('');
    setAnalysis('');
    try {
      const data = Object.entries(cells)
        .filter(([_, value]) => value.trim())
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      if (!data) {
        setError('Please enter some data in the spreadsheet first');
        return;
      }

      let result = '';
      for await (const chunk of analyzeSpreadsheetData(data)) {
        result += chunk;
        setAnalysis(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze data');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportCSV = () => {
    let csv = '';
    for (let r = 0; r < rows; r++) {
      const rowData: string[] = [];
      for (let c = 0; c < cols; c++) {
        const cellKey = getCellKey(r, c);
        rowData.push(`"${getCellValue(cellKey)}"`);
      }
      csv += rowData.join(',') + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('Clear all data?')) {
      setCells({});
      setAnalysis('');
      setSelectedCell(null);
    }
  };

  return (
    <div className="space-y-6">
      <FeatureCard title="Spreadsheet" description="Create spreadsheets with formulas and AI-powered data analysis">
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="text-sm font-medium">
              {selectedCell && (
                <span className="text-blue-600 dark:text-blue-400">
                  Selected: {selectedCell} = {cells[selectedCell] || ''}
                </span>
              )}
            </div>
            <div className="ml-auto flex gap-2">
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="text-sm">
                {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
              </Button>
              <Button onClick={handleExportCSV} className="text-sm">
                Export CSV
              </Button>
              <Button onClick={handleClear} className="text-sm">
                Clear All
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {/* Formula Help */}
          <div className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <strong>Formulas:</strong> =SUM(A1:A5), =AVERAGE(A1:A5), =A1+B2, =A1*B2
          </div>

          {/* Spreadsheet Grid */}
          <div className="overflow-x-auto border border-gray-300 dark:border-gray-600 rounded-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 p-2 text-sm w-12"></th>
                  {Array.from({ length: cols }).map((_, colIndex) => (
                    <th
                      key={colIndex}
                      className="border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 p-2 text-sm w-24"
                    >
                      {getColumnLabel(colIndex)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 p-2 text-sm text-center font-medium">
                      {rowIndex + 1}
                    </td>
                    {Array.from({ length: cols }).map((_, colIndex) => {
                      const cellKey = getCellKey(rowIndex, colIndex);
                      const isSelected = selectedCell === cellKey;
                      return (
                        <td
                          key={cellKey}
                          className={`border border-gray-300 dark:border-gray-600 p-0 ${
                            isSelected ? 'ring-2 ring-blue-500' : ''
                          }`}
                        >
                          <input
                            type="text"
                            value={cells[cellKey] || ''}
                            onChange={(e) => handleCellChange(cellKey, e.target.value)}
                            onFocus={() => setSelectedCell(cellKey)}
                            className="w-full h-full p-2 bg-transparent focus:outline-none text-sm"
                            placeholder={getCellValue(cellKey) || ''}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Analysis Results */}
          {analysis && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-green-800 dark:text-green-300">AI Analysis:</h3>
              <div className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">{analysis}</div>
            </div>
          )}
        </div>
      </FeatureCard>
    </div>
  );
}
