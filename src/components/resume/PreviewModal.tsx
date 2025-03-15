import React from 'react';
import { X, Download, Save } from 'lucide-react';
import ResumePreview from './ResumePreview';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

function PreviewModal({ isOpen, onClose, onSave }: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Resume Preview
            </h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={onSave}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save Resume</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="h-[80vh] overflow-auto bg-gray-100 dark:bg-gray-900">
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;