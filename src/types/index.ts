export interface User {
  id: string;
  email: string;
  subscription_tier: 'free' | 'basic' | 'pro';
  created_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface JobMatch {
  id: string;
  user_id: string;
  resume_id: string;
  job_description: string;
  match_score: number;
  recommendations: string[];
  created_at: string;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  feedback: {
    clarity: number;
    relevance: number;
    professionalism: number;
    tips: string[];
  };
  created_at: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  component: React.ComponentType<{ data: any }>;
}