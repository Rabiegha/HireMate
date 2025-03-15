import React, { useState } from 'react';
import { FeedbackResult, InterviewState } from '../types';
import AudioRecorder from './AudioRecorder';
import QuestionFeedback from './QuestionFeedback';
import ProgressBar from './ProgressBar';
import { ArrowRight } from 'lucide-react';

interface InterviewSessionProps {
  questions: string[];
  currentQuestion: number;
  setCurrentQuestion: (index: number) => void;
  numQuestions: number;
  feedback: FeedbackResult | null;
  setFeedback: (feedback: FeedbackResult | null) => void;
  interviewState: InterviewState;
  setInterviewState: (state: Partial<InterviewState>) => void;
}

function InterviewSession({
  questions,
  currentQuestion,
  setCurrentQuestion,
  numQuestions,
  feedback,
  setFeedback,
  interviewState,
  setInterviewState,
}: InterviewSessionProps) {
  const [transcription, setTranscription] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00');

  const handleNextQuestion = () => {
    if (currentQuestion < numQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setFeedback(null);
      setTranscription('');
      setStartTime(null);
      setElapsedTime('00:00');
    } else {
      setInterviewState({ step: 'complete' });
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Interview Practice</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <ProgressBar
          current={currentQuestion + 1}
          total={numQuestions}
        />

        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Question {currentQuestion + 1}
            </h3>
            <div className="flex items-center space-x-4">
              {interviewState.step === 'interview' && (
                <div className="text-gray-600 dark:text-gray-300 font-mono">
                  {elapsedTime}
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            {questions[currentQuestion]}
          </p>

          <AudioRecorder
            onComplete={(feedback, transcript) => {
              setFeedback(feedback);
              setTranscription(transcript);
            }}
            isRecording={interviewState.step === 'interview'}
            setStartTime={setStartTime}
            setInterviewState={setInterviewState}
          />

          {transcription && (
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Response:
              </h4>
              <p className="text-gray-600 dark:text-gray-400 italic">
                {transcription}
              </p>
            </div>
          )}
        </div>

        {feedback && (
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <span>{currentQuestion < numQuestions - 1 ? 'Next Question' : 'Complete Interview'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {feedback && currentQuestion < numQuestions - 1 && (
        <QuestionFeedback feedback={feedback} />
      )}
    </>
  );
}

export default InterviewSession;