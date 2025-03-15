import React from 'react';

interface ScoreBarProps {
  score: number;
  label: string;
}

function ScoreBar({ score, label }: ScoreBarProps) {
  return (
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
}

export default ScoreBar;