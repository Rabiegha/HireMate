import React from 'react';
import { Download, Maximize2, Eye } from 'lucide-react';

interface PreviewControlsProps {
  onDownload: () => void;
  onFullscreen: () => void;
  onPreview: () => void;
}

function PreviewControls({ onDownload, onFullscreen, onPreview }: PreviewControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onDownload}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Download className="h-4 w-4" />
        <span>Download PDF</span>
      </button>
      
      <button
        onClick={onFullscreen}
        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700"
        title="Full Screen"
      >
        <Maximize2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>

      <button
        onClick={onPreview}
        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700"
        title="Preview"
      >
        <Eye className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
}

export default PreviewControls;