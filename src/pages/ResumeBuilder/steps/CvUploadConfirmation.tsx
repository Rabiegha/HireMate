import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setStep } from '../../../store/slices/resumeSlice';
import { AlertCircle } from 'lucide-react';

function CvUploadConfirmation() {
  const dispatch = useDispatch();
  const uploadedCv = useSelector((state: RootState) => state.resume.uploadedCv);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Upload Confirmation</h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Important Information
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>We'll help you transfer your existing resume content into our modern templates. You can:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Review and edit all imported information</li>
                <li>Choose from our professional templates</li>
                <li>Enhance your resume with additional sections</li>
                <li>Download your improved resume in multiple formats</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {uploadedCv.preview && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Uploaded Resume Preview
          </h3>
          <div className="aspect-[1/1.414] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <iframe
              src={uploadedCv.preview}
              className="w-full h-full"
              title="Resume preview"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => dispatch(setStep(-1))}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => dispatch(setStep(1))} // Skip template selection and go straight to personal info
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue to Editor
        </button>
      </div>
    </div>
  );
}

export default CvUploadConfirmation;