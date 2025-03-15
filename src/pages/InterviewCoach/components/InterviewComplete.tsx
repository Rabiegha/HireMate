import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FeedbackResult } from '../types';
import ScoreBar from './ScoreBar';

interface InterviewCompleteProps {
  feedback: FeedbackResult | null;
  onStartNew: () => void;
}

function InterviewComplete({ feedback, onStartNew }: InterviewCompleteProps) {
  if (!feedback) return null;

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Interview Complete</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <div className="text-4xl text-green-600 dark:text-green-400">
              {feedback.overallScore}%
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Overall Performance
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Strengths</h3>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-center text-green-700 dark:text-green-400"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                    ✓
                  </span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {feedback.improvements.map((improvement, index) => (
                <li
                  key={index}
                  className="flex items-center text-red-700 dark:text-red-400"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-2">
                    !
                  </span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Detailed Scores
          </h3>
          <ScoreBar score={feedback.clarity} label="Clarity" />
          <ScoreBar score={feedback.confidence} label="Confidence" />
          <ScoreBar score={feedback.professionalism} label="Professionalism" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tips for Improvement
          </h3>
          <ul className="space-y-2">
            {feedback.tips.map((tip, index) => (
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

        <div className="mt-8 flex justify-center">
          <button
            onClick={onStartNew}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowRight className="h-5 w-5" />
            <span>Start New Interview</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default InterviewComplete;