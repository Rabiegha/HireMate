import React, { useState, useRef, useEffect } from 'react';
import { Upload, Mic, Play, Square, AlertCircle, ArrowRight, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackResult {
  overallScore: number;
  clarity: number;
  confidence: number;
  professionalism: number;
  tips: string[];
  strengths: string[];
  improvements: string[];
}

type InterviewMode = 'basic' | 'personalized';
type InterviewState = 'setup' | 'ready' | 'recording' | 'analyzing' | 'complete';

function InterviewCoach() {
  const [mode, setMode] = useState<InterviewMode>('basic');
  const [interviewState, setInterviewState] = useState<InterviewState>('setup');
  const [numQuestions, setNumQuestions] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);

  // Audio recording setup
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

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

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current?.state === 'running') {
        audioContextRef.current.close();
      }
    };
  }, []);

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

  const updateAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume level
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    const normalizedLevel = Math.min(average / 128, 1);
    setAudioLevel(normalizedLevel);

    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context and analyser
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((chunks) => [...chunks, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
        handleRecordingComplete(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      updateAudioLevel();
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setInterviewState('analyzing');
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      // Simulated analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockFeedback: FeedbackResult = {
        overallScore: Math.floor(Math.random() * 20) + 70, // 70-90
        clarity: Math.floor(Math.random() * 3) + 7, // 7-9
        confidence: Math.floor(Math.random() * 3) + 6, // 6-8
        professionalism: Math.floor(Math.random() * 3) + 7, // 7-9
        strengths: [
          'Clear communication style',
          'Good use of specific examples',
          'Professional tone',
        ],
        improvements: [
          'Could provide more detailed responses',
          'Consider using more industry-specific terminology',
          'Work on pace of speech',
        ],
        tips: [
          'Structure your answers using the STAR method',
          'Practice active listening',
          'Maintain consistent eye contact',
          'Research common industry terms',
        ],
      };

      setFeedback(mockFeedback);
      
      if (currentQuestion < numQuestions - 1) {
        setCurrentQuestion(prev => prev + 1);
        setInterviewState('ready');
      } else {
        setInterviewState('complete');
      }
      
      setRecordedChunks([]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze interview response');
    } finally {
      setLoading(false);
    }
  };

  const renderAudioVisualizer = () => (
    <div className="relative h-12 mb-4">
      <div className="absolute inset-0 flex items-center justify-center space-x-1">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="w-1 bg-blue-600 rounded-full transition-all duration-50"
            style={{
              height: `${Math.max(4, audioLevel * 48 * (1 + Math.sin(i / 2)))}px`,
              opacity: isRecording ? 1 : 0.3,
              transform: `scaleY(${1 + audioLevel * Math.sin(i / 3)})`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );

  const renderProgressBar = () => (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Question {currentQuestion + 1} of {numQuestions}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / numQuestions) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const renderScoreBar = (score: number, label: string) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-blue-600 font-semibold">{score}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${(score / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  if (interviewState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Interview Setup</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="space-y-6">
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
      </div>
    );
  }

  if (interviewState === 'complete') {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Interview Complete</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <div className="text-4xl text-green-600 dark:text-green-400">
                {feedback?.overallScore}%
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Overall Performance
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Strengths</h3>
              <ul className="space-y-2">
                {feedback?.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex items-center text-green-700 dark:text-green-400"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                      ✓
                    </span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {feedback?.improvements.map((improvement, index) => (
                  <li
                    key={index}
                    className="flex items-center text-red-700 dark:text-red-400"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-2">
                      !
                    </span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Detailed Scores
            </h3>
            {renderScoreBar(feedback?.clarity || 0, 'Clarity')}
            {renderScoreBar(feedback?.confidence || 0, 'Confidence')}
            {renderScoreBar(feedback?.professionalism || 0, 'Professionalism')}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tips for Improvement
            </h3>
            <ul className="space-y-2">
              {feedback?.tips.map((tip, index) => (
                <li
                  key={index}
                  className="flex items-start text-gray-700 dark:text-gray-300"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2 mt-0.5 text-sm">
                    {index + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                setInterviewState('setup');
                setCurrentQuestion(0);
                setFeedback(null);
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowRight className="h-5 w-5" />
              <span>Start New Interview</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Interview Practice</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        {renderProgressBar()}

        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Question {currentQuestion + 1}
            </h3>
            {isRecording && (
              <div className="flex items-center text-red-500">
                <span className="animate-pulse mr-2">●</span>
                Recording
              </div>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            {questions[currentQuestion]}
          </p>

          {renderAudioVisualizer()}

          <div className="flex justify-center">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={loading}
              >
                <Play className="h-5 w-5" />
                <span>Start Answering</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Square className="h-5 w-5" />
                <span>Stop Recording</span>
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
            <span>Analyzing your response...</span>
          </div>
        )}
      </div>

      {feedback && currentQuestion < numQuestions - 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Question Feedback
          </h2>
          
          <div className="mb-8">
            {renderScoreBar(feedback.clarity, 'Clarity')}
            {renderScoreBar(feedback.confidence, 'Confidence')}
            {renderScoreBar(feedback.professionalism, 'Professionalism')}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Quick Tips
            </h3>
            <ul className="space-y-2">
              {feedback.tips.slice(0, 2).map((tip, index) => (
                <li
                  key={index}
                  className="flex items-start text-gray-700 dark:text-gray-300"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2 mt-0.5 text-sm">
                    {index + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewCoach;