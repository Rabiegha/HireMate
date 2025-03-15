import React from 'react';

interface VoiceBarsProps {
  audioLevel: number;
  isRecording: boolean;
}

function VoiceBars({ audioLevel, isRecording }: VoiceBarsProps) {
  return (
    <div className="relative h-12 mb-4">
      <div className="absolute inset-0 flex items-center justify-center space-x-0.5">
        {Array.from({ length: 40 }).map((_, i) => {
          const barHeight = Math.max(
            4,
            audioLevel * 48 * (0.6 + Math.sin(i / 3) * 0.4)
          );

          return (
            <div
              key={i}
              className={`w-1 bg-blue-600 rounded-full transform-gpu transition-all duration-100 ease-out ${
                isRecording ? 'opacity-100' : 'opacity-30'
              }`}
              style={{
                height: `${barHeight}px`,
                transform: `scaleY(${isRecording ? 1 + (audioLevel * Math.sin(i / 2) * 0.5) : 1})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default VoiceBars;