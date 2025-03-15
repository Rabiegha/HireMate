import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { FeedbackResult } from '../types';

interface CompleteStepProps {
  feedback: FeedbackResult | null;
  onStartNew: () => void;
  totalDuration: string;
}

function CompleteStep({ feedback, onStartNew, totalDuration }: CompleteStepProps) {
  if (!feedback) return null;

  const renderScoreBar = (score: number, label: string) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-blue-600 font-semibold">{score}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${(score / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Interview Complete</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <div className="text-4xl text-green-600 dark:text-green-400">
              {feedback.overallScore}%
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Overall Performance
          </h2>
          <div className="flex items-center justify-center mt-2 text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-2" />
            <span>Total Interview Duration: {totalDuration}</span>
          </div>
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
          {renderScoreBar(feedback.clarity, 'Clarity')}
          {renderScoreBar(feedback.confidence, 'Confidence')}
          {renderScoreBar(feedback.professionalism, 'Professionalism')}
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

export default CompleteStep;