'use client';

import { toLocalTime } from '@utils/dateUtils';
import { StudyBlock } from '@api';
import React from 'react';

interface StudyBlockProps {
  block: StudyBlock;
  zoomLevel: number;
  calculatePosition: (date: Date, zoomLevel: number) => number;
  onDoubleClick: () => void;
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const StudyBlockComponent: React.FC<StudyBlockProps> = ({ block, zoomLevel, calculatePosition, onDoubleClick }) => {
  const startTime = toLocalTime(block.start_time);
  const endTime = block.end_time ? toLocalTime(block.end_time) : new Date();

  console.log('StudyBlock - Original start time:', block.start_time);
  console.log('StudyBlock - Converted start time:', startTime.toLocaleString());
  console.log('StudyBlock - Original end time:', block.end_time);
  console.log('StudyBlock - Converted end time:', endTime.toLocaleString());

  const startPosition = calculatePosition(startTime, zoomLevel);
  const endPosition = calculatePosition(endTime, zoomLevel);
  const duration = Math.max(endPosition - startPosition, 20);

  console.log('StudyBlock - Start position:', startPosition);
  console.log('StudyBlock - End position:', endPosition);
  console.log('StudyBlock - Duration:', duration);

  return (
    <li
      className="absolute left-0 right-0 flex flex-col overflow-hidden rounded-lg bg-blue-50 text-xs leading-5 hover:bg-blue-100 cursor-pointer"
      style={{
        top: `${startPosition}px`,
        height: `${duration}px`,
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
    </li>
  );
};

export default StudyBlockComponent;
