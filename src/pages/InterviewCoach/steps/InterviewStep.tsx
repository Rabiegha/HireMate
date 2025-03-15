import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { InterviewState, FeedbackResult } from '../types';
import ScoreBar from '../components/ScoreBar';
import Timer from '../components/Timer';
import VoiceBars from '../components/VoiceBars';

interface InterviewStepProps {
  state: InterviewState;
  updateState: (updates: Partial<InterviewState>) => void;
  onComplete: () => void;
}

function InterviewStep({ state, updateState, onComplete }: InterviewStepProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [currentFeedback, setCurrentFeedback] = useState<FeedbackResult | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [answerTime, setAnswerTime] = useState('00:00');
  const [totalDuration, setTotalDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

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

  const updateAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    const normalizedLevel = Math.min(average / 128, 1);
    setAudioLevel(normalizedLevel);

    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
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
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      // Simulated analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock transcription
      const mockTranscript = "I believe my greatest strength is my ability to adapt quickly to new situations and learn from challenges. Throughout my career, I've consistently demonstrated this by taking on new responsibilities and successfully delivering results. For example, in my previous role, I had to learn a new technology stack within a short timeframe to lead a critical project. Not only did I master the required skills, but I also helped train other team members, which ultimately contributed to the project's success.";

      const mockFeedback: FeedbackResult = {
        overallScore: Math.floor(Math.random() * 20) + 70,
        clarity: Math.floor(Math.random() * 3) + 7,
        confidence: Math.floor(Math.random() * 3) + 6,
        professionalism: Math.floor(Math.random() * 3) + 7,
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
        duration: answerTime,
      };

      setTranscription(mockTranscript);
      setCurrentFeedback(mockFeedback);
      setShowNextButton(true);
      
      // Update total duration
      const [mins, secs] = answerTime.split(':').map(Number);
      const durationInSeconds = mins * 60 + secs;
      setTotalDuration(prev => prev + durationInSeconds);
      
      updateState({ 
        feedback: mockFeedback,
        totalDuration: formatDuration(totalDuration + durationInSeconds)
      });
      
      setRecordedChunks([]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze interview response');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    if (state.currentQuestion < state.numQuestions - 1) {
      updateState({ currentQuestion: state.currentQuestion + 1 });
      setTranscription('');
      setCurrentFeedback(null);
      setShowNextButton(false);
      setAnswerTime('00:00');
    } else {
      onComplete();
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Interview Practice</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Question {state.currentQuestion + 1} of {state.numQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((state.currentQuestion + 1) / state.numQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Question {state.currentQuestion + 1}
            </h3>
            <div className="flex items-center space-x-4">
              <Timer 
                isRunning={isRecording} 
                onTimeUpdate={setAnswerTime}
              />
              {isRecording && (
                <div className="flex items-center text-red-500">
                  <span className="animate-pulse mr-2">●</span>
                  Recording
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            {state.questions[state.currentQuestion]}
          </p>

          <VoiceBars audioLevel={audioLevel} isRecording={isRecording} />

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
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mt-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
            <span>Analyzing your response...</span>
          </div>
        )}

        {transcription && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Response:
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Duration: {answerTime}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 italic">
              {transcription}
            </p>
          </div>
        )}

        {currentFeedback && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Question Feedback
            </h4>
            
            <div className="mb-6">
              <ScoreBar score={currentFeedback.clarity} label="Clarity" />
              <ScoreBar score={currentFeedback.confidence} label="Confidence" />
              <ScoreBar score={currentFeedback.professionalism} label="Professionalism" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Strengths</h5>
                <ul className="space-y-2">
                  {currentFeedback.strengths.map((strength, index) => (
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
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                  Areas for Improvement
                </h5>
                <ul className="space-y-2">
                  {currentFeedback.improvements.map((improvement, index) => (
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

            {showNextButton && (
              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <span>
                    {state.currentQuestion < state.numQuestions - 1
                      ? 'Next Question'
                      : 'Complete Interview'}
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default InterviewStep;