import React from 'react';
import { FeedbackResult } from '../types';
import ScoreBar from './ScoreBar';

interface QuestionFeedbackProps {
  feedback: FeedbackResult;
}

function QuestionFeedback({ feedback }: QuestionFeedbackProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Question Feedback
      </h2>
      
      <div className="mb-8">
        <ScoreBar score={feedback.clarity} label="Clarity" />
        <ScoreBar score={feedback.confidence} label="Confidence" />
        <ScoreBar score={feedback.professionalism} label="Professionalism" />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Quick Tips
        </h3>
        <ul className="space-y-2">
          {feedback.tips.slice(0, 2).map((tip, index) => (
            <li
              key={index}
              className="flex items-start text-gray-700 dark:text-gray-300"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2 mt-0.5 text-sm">
                {index + 1}
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default QuestionFeedback;