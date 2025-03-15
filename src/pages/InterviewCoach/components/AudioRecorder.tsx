import React, { useState, useRef, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { toast } from 'sonner';
import { FeedbackResult } from '../types';

interface AudioRecorderProps {
  onComplete: (feedback: FeedbackResult, transcript: string) => void;
  isRecording: boolean;
  setStartTime: (date: Date | null) => void;
  setInterviewState: (state: any) => void;
}

function AudioRecorder({ onComplete, isRecording, setStartTime, setInterviewState }: AudioRecorderProps) {
  const [audioLevel, setAudioLevel] = useState(0);
  const [loading, setLoading] = useState(false);
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
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
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
      setStartTime(new Date());
      setInterviewState({ step: 'interview' });
      updateAudioLevel();
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setStartTime(null);
      setInterviewState({ step: 'analyzing' });
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
      };

      onComplete(mockFeedback, mockTranscript);
      setRecordedChunks([]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze interview response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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

      {loading && (
        <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mt-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
          <span>Analyzing your response...</span>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;