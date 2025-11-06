import { useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import Button from '../components/Button';
import { generatePresentation } from '../services/geminiService';

interface Slide {
  id: number;
  title: string;
  content: string;
  notes: string;
}

export default function PresentationMaker() {
  const [slides, setSlides] = useState<Slide[]>([
    { id: 1, title: 'Title Slide', content: 'Click to edit', notes: '' }
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const currentSlide = slides[currentSlideIndex];

  const updateSlide = (updates: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = { ...currentSlide, ...updates };
    setSlides(newSlides);
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now(),
      title: 'New Slide',
      content: 'Click to edit',
      notes: ''
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const deleteSlide = () => {
    if (slides.length === 1) {
      alert('Cannot delete the last slide');
      return;
    }
    if (confirm('Delete this slide?')) {
      const newSlides = slides.filter((_, index) => index !== currentSlideIndex);
      setSlides(newSlides);
      setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
    }
  };

  const duplicateSlide = () => {
    const duplicated: Slide = {
      ...currentSlide,
      id: Date.now()
    };
    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, duplicated);
    setSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
  };

  const handleGeneratePresentation = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for the presentation');
      return;
    }

    setIsGenerating(true);
    setError('');
    try {
      const generatedSlides = await generatePresentation(topic);
      setSlides(generatedSlides);
      setCurrentSlideIndex(0);
      setTopic('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate presentation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    const exportData = slides.map((slide, index) => ({
      slideNumber: index + 1,
      title: slide.title,
      content: slide.content,
      notes: slide.notes
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = 'presentation.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <FeatureCard title="Presentation Maker" description="Create presentations with AI-powered slide generation">
        <div className="space-y-4">
          {/* AI Generation */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold mb-2 text-purple-800 dark:text-purple-300">Generate Presentation with AI</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter presentation topic (e.g., 'Climate Change Solutions')"
                className="flex-1 px-4 py-2 border border-purple-300 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && handleGeneratePresentation()}
              />
              <Button onClick={handleGeneratePresentation} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Button onClick={addSlide} className="text-sm">
              + Add Slide
            </Button>
            <Button onClick={duplicateSlide} className="text-sm">
              Duplicate
            </Button>
            <Button onClick={deleteSlide} className="text-sm" disabled={slides.length === 1}>
              Delete
            </Button>
            <div className="ml-auto flex gap-2 items-center">
              <span className="text-sm">
                Slide {currentSlideIndex + 1} of {slides.length}
              </span>
              <Button onClick={handleExport} className="text-sm">
                Export
              </Button>
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="text-sm"
            >
              Previous
            </Button>
            <div className="flex-1 flex gap-2 overflow-x-auto py-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`flex-shrink-0 w-32 h-20 p-2 border-2 rounded-lg text-xs overflow-hidden ${
                    index === currentSlideIndex
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="font-semibold truncate">{slide.title}</div>
                  <div className="text-gray-500 dark:text-gray-400 truncate">{slide.content}</div>
                </button>
              ))}
            </div>
            <Button
              onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === slides.length - 1}
              className="text-sm"
            >
              Next
            </Button>
          </div>

          {/* Slide Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Slide Preview */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Slide Preview</h3>
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 flex flex-col justify-center items-center text-white shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4">{currentSlide.title}</h1>
                <div className="text-lg text-center whitespace-pre-wrap">{currentSlide.content}</div>
              </div>
            </div>

            {/* Slide Content Editor */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={currentSlide.title}
                  onChange={(e) => updateSlide({ title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={currentSlide.content}
                  onChange={(e) => updateSlide({ content: e.target.value })}
                  className="w-full h-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Speaker Notes</label>
                <textarea
                  value={currentSlide.notes}
                  onChange={(e) => updateSlide({ notes: e.target.value })}
                  placeholder="Add notes for this slide..."
                  className="w-full h-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </FeatureCard>
    </div>
  );
}
