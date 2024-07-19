'use client';

import { StudyBlock } from '@api';
import { toLocalTime } from '@utils/dateUtils';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

interface StudyBlockProps {
  block: StudyBlock;
  calculatePosition: (date: Date) => number;
  onClick: () => void;
  currentTime: Date;
}

const formatTime = (date: Date): string => {
  return format(date, 'h:mm aaa');
};

const StudyBlockComponent: React.FC<StudyBlockProps> = ({ block, calculatePosition, onClick, currentTime }) => {
  const startTime = toLocalTime(block.start_time);
  const [endTime, setEndTime] = useState(block.end_time ? toLocalTime(block.end_time) : currentTime);
  const isInProgress = !block.end_time;

  useEffect(() => {
    if (isInProgress) {
      setEndTime(currentTime);
    }
  }, [isInProgress, currentTime]);

  const startPosition = calculatePosition(startTime);
  const endPosition = calculatePosition(endTime);
  const height = Math.max(endPosition - startPosition, 0.1);

  return (
    <li
      className={classNames(
        'absolute left-0 right-0 flex items-center overflow-hidden rounded-lg text-xs leading-5 cursor-pointer mx-2',
        {
          'bg-blue-50 hover:bg-blue-100 opacity-90': !isInProgress,
          'bg-blue-100 hover:bg-blue-200': isInProgress,
          'z-10': isInProgress,
        },
      )}
      style={{
        top: `${startPosition}%`,
        height: `max(${height}%, 1.5em)`,
      }}
      onClick={onClick}
    >
      <div className="flex-1 px-1 truncate text-blue-700 flex justify-between items-center">
        <div className="flex-shrink-0">
          <span className="font-semibold">{formatTime(startTime)}</span>
          {block.end_time && <span className="font-semibold"> - {formatTime(endTime)}</span>}
          {isInProgress && <span className=""> - In Progress</span>}
          {isInProgress && <span className="ml-1 animate-pulse text-red-500">•</span>}
        </div>
        <span className="flex-shrink-0 text-blue-300">{block.is_countdown ? 'timer' : 'open'}</span>
      </div>
    </li>
  );
};

export default StudyBlockComponent;
