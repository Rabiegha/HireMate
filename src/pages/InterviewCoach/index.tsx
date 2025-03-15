import React, { useState } from 'react';
import { InterviewMode, InterviewState, FeedbackResult } from './types';
import StartStep from './steps/StartStep';
import ModeStep from './steps/ModeStep';
import QuestionsStep from './steps/QuestionsStep';
import SetupStep from './steps/SetupStep';
import InterviewStep from './steps/InterviewStep';
import CompleteStep from './steps/CompleteStep';

const initialState: InterviewState = {
  step: 'start',
  mode: 'basic',
  numQuestions: 5,
  currentQuestion: 0,
  questions: [],
  feedback: null,
  jobDescription: '',
  resumeFile: null,
  totalDuration: '00:00',
};

function InterviewCoach() {
  const [state, setState] = useState<InterviewState>(initialState);

  const updateState = (updates: Partial<InterviewState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleModeSelect = (mode: InterviewMode) => {
    updateState({ mode, step: mode === 'basic' ? 'questions' : 'setup' });
  };

  const handleSetupComplete = (jobDescription: string, resumeFile: File) => {
    updateState({
      jobDescription,
      resumeFile,
      step: 'questions',
    });
  };

  const handleQuestionsSet = (numQuestions: number) => {
    updateState({
      numQuestions,
      step: 'interview',
      questions: state.mode === 'basic' ? [
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
      ].slice(0, numQuestions) : [
        `Based on your experience with ${state.jobDescription.split(' ')[0]}, what specific skills would you bring to this role?`,
        "How have you demonstrated leadership in your previous positions?",
        "Can you describe a project where you used your technical expertise?",
        "What interests you most about this industry?",
        "How do you stay updated with industry trends?",
        "Describe a situation where you had to learn a new technology quickly",
        "How do you handle tight deadlines?",
        "What's your approach to problem-solving?",
        "How do you collaborate with cross-functional teams?",
        "What's your biggest professional achievement?",
      ].slice(0, numQuestions),
    });
  };

  const handleInterviewComplete = () => {
    updateState({ step: 'complete' });
  };

  const handleStartNew = () => {
    setState(initialState);
  };

  const renderStep = () => {
    switch (state.step) {
      case 'start':
        return <StartStep onNext={() => updateState({ step: 'mode' })} />;
      case 'mode':
        return (
          <ModeStep
            mode={state.mode}
            onModeSelect={handleModeSelect}
            onBack={() => updateState({ step: 'start' })}
          />
        );
      case 'setup':
        return (
          <SetupStep
            onSetupComplete={handleSetupComplete}
            onBack={() => updateState({ step: 'mode' })}
          />
        );
      case 'questions':
        return (
          <QuestionsStep
            numQuestions={state.numQuestions}
            onQuestionsSet={handleQuestionsSet}
            onBack={() => updateState({ step: state.mode === 'basic' ? 'mode' : 'setup' })}
          />
        );
      case 'interview':
        return (
          <InterviewStep
            state={state}
            updateState={updateState}
            onComplete={handleInterviewComplete}
          />
        );
      case 'complete':
        return (
          <CompleteStep
            feedback={state.feedback}
            onStartNew={handleStartNew}
            totalDuration={state.totalDuration}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {renderStep()}
    </div>
  );
}

export default InterviewCoach;