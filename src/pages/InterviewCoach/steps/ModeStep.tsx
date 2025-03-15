import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { InterviewMode } from '../types';

interface ModeStepProps {
  mode: InterviewMode;
  onModeSelect: (mode: InterviewMode) => void;
  onBack: () => void;
}

function ModeStep({ mode, onModeSelect, onBack }: ModeStepProps) {
  return (
    <>
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white ml-4">
          Choose Interview Type
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => onModeSelect('basic')}
          className={`p-6 rounded-lg border-2 transition-colors ${
            mode === 'basic'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
          }`}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Basic Interview
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Practice with standard interview questions suitable for any position. Perfect for general interview preparation.
          </p>
        </button>

        <button
          onClick={() => onModeSelect('personalized')}
          className={`p-6 rounded-lg border-2 transition-colors ${
            mode === 'personalized'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
          }`}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Personalized Interview
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Get AI-generated questions based on your resume and target job description. Tailored to your specific career goals.
          </p>
        </button>
      </div>
    </>
  );
}

export default ModeStep