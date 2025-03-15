import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import templates from '../../templates';
import { Download, Maximize2 } from 'lucide-react';

interface SidePreviewProps {
  onFullscreen?: () => void;
}

function SidePreview({ onFullscreen }: SidePreviewProps) {
  const resumeData = useSelector((state: RootState) => state.resume);

  if (!templates[resumeData.template]) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a template to preview your resume</p>
      </div>
    );
  }

  const Template = templates[resumeData.template].component;

  return (
    <div className="relative h-full">
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        {onFullscreen && (
          <button
            onClick={onFullscreen}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Full Screen"
          >
            <Maximize2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>

      <div className="h-full overflow-auto bg-gray-100 dark:bg-gray-900 p-4">
        <div className="preview-container scale-side">
          <div className="resume-content">
            <Template data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidePreview;