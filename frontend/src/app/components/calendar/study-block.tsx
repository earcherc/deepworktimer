'use client';

import { calculateGridPosition } from '@utils/timeUtils';
import { toLocalTime } from '@utils/dateUtils';
import { StudyBlock } from '@api';
import React from 'react';

interface StudyBlockProps {
  block: StudyBlock;
  zoomLevel: number;
  calculatePosition: (date: Date, zoomLevel: number) => number;
  onDoubleClick: () => void;
  totalBlocks: number;
  style?: React.CSSProperties;
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const StudyBlockComponent: React.FC<StudyBlockProps> = ({
  block,
  zoomLevel,
  calculatePosition,
  onDoubleClick,
  totalBlocks,
  style,
}) => {
  const startTime = toLocalTime(block.start_time);
  const endTime = block.end_time ? toLocalTime(block.end_time) : new Date();

  const startPosition = calculateGridPosition(startTime, zoomLevel);
  const endPosition = calculateGridPosition(endTime, zoomLevel);
  const duration = Math.max(endPosition - startPosition, 20); // Minimum height of 20px

  return (
    <div
      className="absolute flex flex-col overflow-hidden rounded-lg bg-blue-50 text-xs leading-5 hover:bg-blue-100 cursor-pointer"
      style={{
        top: `${startPosition}px`,
        height: `${duration}px`,
        ...style,
      }}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex-1 p-1 truncate">
        <p className="font-semibold text-blue-700">
          {formatTime(startTime)} - {block.end_time ? formatTime(endTime) : 'In Progress'}
        </p>
        {duration > 25 && (
          <p className="text-blue-500">
            {block.is_countdown ? 'Countdown' : 'Session'}
            {!block.end_time && <span className="ml-1 animate-pulse text-red-500">•</span>}
          </p>
        )}
      </div>
    </div>
  );
};

export default StudyBlockComponent;
