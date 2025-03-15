import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { Download, Maximize2 } from 'lucide-react';
import type { RootState } from '../../store';
import templates from '../../templates';

interface ResumePreviewProps {
  onFullscreen?: () => void;
  scale?: 'small' | 'medium' | 'large';
}

function ResumePreview({ onFullscreen, scale = 'medium' }: ResumePreviewProps) {
  const resumeData = useSelector((state: RootState) => state.resume);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `Resume_${resumeData.personalInfo.firstName || 'Untitled'}_${new Date().toISOString().split('T')[0]}`,
  });

  if (!templates[resumeData.template]) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a template to preview your resume</p>
      </div>
    );
  }

  const Template = templates[resumeData.template].component;
  const scaleClass = {
    small: 'scale-small',
    medium: 'scale-medium',
    large: 'scale-large',
  }[scale];

  return (
    <div className="relative h-full">
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <button
          onClick={handlePrint}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          title="Download PDF"
        >
          <Download className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
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
        <div className={`preview-wrapper ${scaleClass}`}>
          <div ref={contentRef} className="a4-container">
            <Template data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumePreview;

export { ResumePreview }