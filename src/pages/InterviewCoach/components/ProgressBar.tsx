import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Question {current} of {total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;