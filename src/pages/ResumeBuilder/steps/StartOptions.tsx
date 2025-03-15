import React from 'react';
import { useDispatch } from 'react-redux';
import { FileText, Upload } from 'lucide-react';
import { setStartOption, setStep, setUploadedCv } from '../../../store/slices/resumeSlice';
import { toast } from 'sonner';

function StartOptions() {
  const dispatch = useDispatch();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && file.type !== 'application/msword' && 
        file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    try {
      // Create a preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      
      dispatch(setUploadedCv({ file, preview: previewUrl }));
      dispatch(setStartOption('upload'));
      dispatch(setStep(0)); // This will show the confirmation page
    } catch (error) {
      toast.error('Failed to process the uploaded file');
    }
  };

  const handleNewResume = () => {
    dispatch(setStartOption('new'));
    dispatch(setStep(0)); // This will show the template selection
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
        How would you like to start?
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <button
          onClick={handleNewResume}
          className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <FileText className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Create New Resume
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Start fresh with our step-by-step resume builder
          </p>
        </button>

        <label className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <Upload className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Upload Existing Resume
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Import and enhance your existing resume
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-8 text-center text-gray-600 dark:text-gray-300">
        <p>Supported formats: PDF, DOC, DOCX</p>
      </div>
    </div>
  );
}

export default StartOptions;