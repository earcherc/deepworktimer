'use client';
import { toLocalTime } from '@utils/dateUtils';
import { format } from 'date-fns';
import { StudyBlock } from '@api';
import React from 'react';

interface StudyBlockProps {
  block: StudyBlock;
  calculatePosition: (date: Date) => number;
  onDoubleClick: () => void;
}

const formatTime = (date: Date): string => {
  return format(date, 'h:mm aaa');
};

const StudyBlockComponent: React.FC<StudyBlockProps> = ({ block, calculatePosition, onDoubleClick }) => {
  const startTime = toLocalTime(block.start_time);
  const endTime = block.end_time ? toLocalTime(block.end_time) : new Date();
  const startPosition = calculatePosition(startTime);
  const endPosition = calculatePosition(endTime);
  const height = Math.max(endPosition - startPosition, 0.1);

  return (
    <li
      className="absolute left-0 right-0 flex items-center overflow-hidden rounded-lg bg-blue-50 text-xs leading-5 hover:bg-blue-100 cursor-pointer"
      style={{
        top: `${startPosition}%`,
        height: `${height}%`,
        minHeight: '1.5em', // Ensures one line of text is always visible
      }}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex-1 px-1 truncate text-blue-700 flex justify-between items-center">
        <div className="flex-shrink-0">
          <span className="font-semibold">{formatTime(startTime)}</span>
          {block.end_time && <span className="font-semibold"> - {formatTime(endTime)}</span>}
          {!block.end_time && <span className=""> - In Progress</span>}
          {!block.end_time && <span className="ml-1 animate-pulse text-red-500">•</span>}
        </div>
        <span className="flex-shrink-0 text-blue-300">{block.is_countdown ? 'countdown' : 'open session'}</span>
      </div>
    </li>
  );
};

export default StudyBlockComponent;
