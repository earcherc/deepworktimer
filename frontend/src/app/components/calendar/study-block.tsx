'use client';

import { useTimeManagement } from '@hooks/useTimeManagement';
import React, { useEffect, useState } from 'react';
import { toLocalTime } from '@utils/dateUtils';
import classNames from 'classnames';
import { format } from 'date-fns';
import { StudyBlock } from '@api';

interface StudyBlockProps {
  block: StudyBlock;
  calculatePosition: (date: Date) => number;
  onClick: () => void;
}

const formatTime = (date: Date): string => {
  return format(date, 'h:mm aaa');
};

const StudyBlockComponent: React.FC<StudyBlockProps> = ({ block, calculatePosition, onClick }) => {
  const { currentTime } = useTimeManagement();
  const [endTime, setEndTime] = useState<Date | null>(null);

  const startTime = toLocalTime(block.start_time);
  const isInProgress = !block.end_time;

  useEffect(() => {
    if (block.end_time) {
      setEndTime(toLocalTime(block.end_time));
    } else if (currentTime) {
      setEndTime(currentTime);
    }
  }, [block.end_time, currentTime]);

  if (!endTime) return null;

  const startPosition = calculatePosition(startTime);
  const endPosition = calculatePosition(endTime);
  const height = Math.max(endPosition - startPosition, 0.1);

  return (
    <li
      className={classNames(
        'absolute left-0 right-0 flex items-center overflow-hidden rounded-lg text-xs leading-5 cursor-pointer mx-1',
        {
          'bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 opacity-90': !isInProgress,
          'bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700': isInProgress,
          'z-10': isInProgress,
        },
      )}
      style={{
        top: `${startPosition}%`,
        height: `max(${height}%, 1.5em)`,
      }}
      onClick={onClick}
    >
      <div className="flex-1 px-3 truncate text-blue-700 dark:text-blue-300 flex justify-between items-center">
        <div className="flex-shrink-0">
          <span className="font-semibold">{formatTime(startTime)}</span>
          {block.end_time && <span className="font-semibold"> - {formatTime(endTime)}</span>}
          {isInProgress && <span className=""> - In Progress</span>}
          {isInProgress && <span className="ml-1 animate-pulse text-red-500 dark:text-red-400">•</span>}
        </div>
        <span className="flex-shrink-0 text-blue-300 dark:text-blue-500">{block.is_countdown ? 'timer' : 'open'}</span>
      </div>
    </li>
  );
};

export default StudyBlockComponent;
