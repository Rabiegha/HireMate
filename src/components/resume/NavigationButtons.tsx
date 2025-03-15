import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  showNext?: boolean;
  showBack?: boolean;
}

function NavigationButtons({
  onBack,
  onNext,
  nextLabel = 'Next',
  backLabel = 'Back',
  showNext = true,
  showBack = true,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between mt-8">
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{backLabel}</span>
        </button>
      )}
      {showNext && onNext && (
        <button
          type="button"
          onClick={onNext}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
        >
          <span>{nextLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default NavigationButtons;