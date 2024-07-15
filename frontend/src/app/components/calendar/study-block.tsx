'use client';

import { toLocalTime } from '@utils/dateUtils';
import { format } from 'date-fns';
import { StudyBlock } from '@api';
import React from 'react';

interface StudyBlockProps {
  block: StudyBlock;
  zoomLevel: number;
  calculatePosition: (date: Date) => number;
  onDoubleClick: () => void;
}

const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

const StudyBlockComponent: React.FC<StudyBlockProps> = ({ block, zoomLevel, calculatePosition, onDoubleClick }) => {
  const startTime = toLocalTime(block.start_time);
  const endTime = block.end_time ? toLocalTime(block.end_time) : new Date();

  const startPosition = calculatePosition(startTime);
  const endPosition = calculatePosition(endTime);
  const duration = Math.max(endPosition - startPosition, 1); // Ensure minimum 1% height

  return (
    <li
      className="absolute left-0 right-0 flex flex-col overflow-hidden rounded-lg bg-blue-50 text-xs leading-5 hover:bg-blue-100 cursor-pointer"
      style={{
        top: `${startPosition}%`,
        height: `${duration}%`,
        minHeight: `${20 / zoomLevel}px`, // Adjust minimum height based on zoom level
      }}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex-1 p-1 truncate">
        <p className="font-semibold text-blue-700">
          {formatTime(startTime)} - {block.end_time ? formatTime(endTime) : 'In Progress'}
        </p>
        {duration > 25 / zoomLevel && (
          <p className="text-blue-500">
            {block.is_countdown ? 'Countdown' : 'Session'}
            {!block.end_time && <span className="ml-1 animate-pulse text-red-500">•</span>}
          </p>
        )}
      </div>
    </li>
  );
};

export default StudyBlockComponent;
