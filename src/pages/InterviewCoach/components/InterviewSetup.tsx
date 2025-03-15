import React, { useState } from 'react';
import { FileText, Play } from 'lucide-react';
import { toast } from 'sonner';
import { InterviewMode, InterviewState } from '../types';

interface InterviewSetupProps {
  mode: InterviewMode;
  setMode: (mode: InterviewMode) => void;
  numQuestions: number;
  setNumQuestions: (num: number) => void;
  setQuestions: (questions: string[]) => void;
  setInterviewState: (state: InterviewState) => void;
}

const basicQuestions = [
  "Tell me about yourself.",
  "What are your greatest strengths?",
  "Where do you see yourself in 5 years?",
  "Why should we hire you?",
  "What's your biggest weakness?",
  "Describe a challenging situation at work.",
  "How do you handle stress?",
  "What are your salary expectations?",
  "Why do you want to work here?",
  "Do you have any questions for us?",
];

function InterviewSetup({
  mode,
  setMode,
  numQuestions,
  setNumQuestions,
  setQuestions,
  setInterviewState,
}: InterviewSetupProps) {
  const [loading, setLoading] = useState(false);
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

  const generatePersonalizedQuestions = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with AI API to generate questions
      // For now, using mock personalized questions
      const mockPersonalizedQuestions = [
        `Based on your experience with ${jobDescription.split(' ')[0]}, what specific skills would you bring to this role?`,
        "How have you demonstrated leadership in your previous positions?",
        "Can you describe a project where you used your technical expertise?",
        "What interests you most about this industry?",
        "How do you stay updated with industry trends?",
        "Describe a situation where you had to learn a new technology quickly",
        "How do you handle tight deadlines?",
        "What's your approach to problem-solving?",
        "How do you collaborate with cross-functional teams?",
        "What's your biggest professional achievement?",
      ];

      setQuestions(mockPersonalizedQuestions.slice(0, numQuestions));
      setInterviewState('ready');
    } catch (error) {
      toast.error('Failed to generate personalized questions');
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    if (mode === 'personalized' && (!jobDescription || !resumeFile)) {
      toast.error('Please provide both job description and resume');
      return;
    }

    if (mode === 'personalized') {
      await generatePersonalizedQuestions();
    } else {
      setQuestions(basicQuestions.slice(0, numQuestions));
      setInterviewState('ready');
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Interview Setup</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="space-y-6">
          {/* Question Count Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Questions
            </label>
            <input
              type="range"
              min="5"
              max="10"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
              <span>5 questions</span>
              <span>{numQuestions} selected</span>
              <span>10 questions</span>
            </div>
          </div>

          {/* Interview Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interview Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode('basic')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  mode === 'basic'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Basic Interview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Standard interview questions suitable for any position
                </p>
              </button>

              <button
                onClick={() => setMode('personalized')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  mode === 'personalized'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Personalized Interview
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-generated questions based on your resume and job description
                </p>
              </button>
            </div>
          </div>

          {/* Personalized Interview Fields */}
          {mode === 'personalized' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
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
            </>
          )}

          {/* Start Button */}
          <button
            onClick={startInterview}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Preparing Questions...</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Start Interview</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default InterviewSetup;