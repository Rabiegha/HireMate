import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface QuestionsStepProps {
  numQuestions: number;
  onQuestionsSet: (num: number) => void;
  onBack: () => void;
}

function QuestionsStep({ numQuestions, onQuestionsSet, onBack }: QuestionsStepProps) {
  const [selectedNumber, setSelectedNumber] = useState<number>(numQuestions);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelect = (num: number) => {
    setSelectedNumber(num);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onQuestionsSet(selectedNumber);
  };

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
          Number of Questions
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Choose how many questions you'd like to practice with. We recommend starting with 5 questions for a focused session.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => handleSelect(num)}
                className={`p-8 rounded-lg transition-all transform hover:scale-105 ${
                  selectedNumber === num
                    ? 'bg-blue-600 text-white scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-3xl font-bold">{num}</span>
                <span className="block text-sm mt-1">questions</span>
              </button>
            ))}
          </div>

          {showConfirmation && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleConfirm}
                className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Start with {selectedNumber} Questions</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default QuestionsStep;