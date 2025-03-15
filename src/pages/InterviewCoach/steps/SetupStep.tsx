import React, { useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface SetupStepProps {
  onSetupComplete: (jobDescription: string, resumeFile: File) => void;
  onBack: () => void;
}

function SetupStep({ onSetupComplete, onBack }: SetupStepProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword')) {
      setResumeFile(file);
    } else {
      toast.error('Please upload a PDF or DOC file');
    }
  };

  const handleSubmit = () => {
    if (!jobDescription.trim() || !resumeFile) {
      toast.error('Please provide both job description and resume');
      return;
    }
    onSetupComplete(jobDescription, resumeFile);
  };

  return (
    <>
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white ml-4">
          Interview Setup
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Paste the job description here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Resume
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PDF or DOC up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SetupStep;