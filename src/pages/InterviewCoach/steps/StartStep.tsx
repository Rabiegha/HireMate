import React from 'react';
import { Play } from 'lucide-react';

interface StartStepProps {
  onNext: () => void;
}

function StartStep({ onNext }: StartStepProps) {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Interview Practice
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        Practice your interview skills with our AI-powered interview coach. Get real-time feedback and improve your performance.
      </p>
      <button
        onClick={onNext}
        className="inline-flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium transition-colors"
      >
        <Play className="h-6 w-6" />
        <span>Start Practice</span>
      </button>
    </div>
  );
}

export default StartStep