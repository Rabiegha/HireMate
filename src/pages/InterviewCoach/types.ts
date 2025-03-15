export interface FeedbackResult {
  overallScore: number;
  clarity: number;
  confidence: number;
  professionalism: number;
  tips: string[];
  strengths: string[];
  improvements: string[];
  duration?: string;
}

export type InterviewMode = 'basic' | 'personalized';
export type InterviewStep = 'start' | 'mode' | 'setup' | 'questions' | 'interview' | 'complete';

export interface InterviewState {
  step: InterviewStep;
  mode: InterviewMode;
  numQuestions: number;
  currentQuestion: number;
  questions: string[];
  feedback: FeedbackResult | null;
  jobDescription: string;
  resumeFile: File | null;
  totalDuration: string;
}