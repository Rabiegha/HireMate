import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (time: string) => void;
}

function Timer({ isRunning, onTimeUpdate }: TimerProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (onTimeUpdate) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      onTimeUpdate(formattedTime);
    }
  }, [time, onTimeUpdate]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
      <Clock className="h-4 w-4" />
      <span className="font-mono">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

export default Timer;