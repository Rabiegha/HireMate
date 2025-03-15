import React from 'react';
import { X } from 'lucide-react';
import { ResumePreview } from './ResumePreview';

interface FullScreenPreviewProps {
  onClose: () => void;
}

function FullScreenPreview({ onClose }: FullScreenPreviewProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
      <button
        onClick={onClose}
        className="absolute top-4 left-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <div className="h-full p-8">
        <ResumePreview isFullPage={true} />
      </div>
    </div>
  );
}

export default FullScreenPreview;