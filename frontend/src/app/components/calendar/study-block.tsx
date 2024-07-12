'use client';

import { StudyBlock as StudyBlockType } from '@api';
import React, { useEffect, useState } from 'react';

const timeToGridRow = (start: string, end: string | undefined): string => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const startTotalMinutes = startDate.getUTCHours() * 60 + startDate.getUTCMinutes();
  const endTotalMinutes = endDate.getUTCHours() * 60 + endDate.getUTCMinutes();
  const gridRowStart = startTotalMinutes + 2;
  const gridRowEnd = endTotalMinutes + 2;
  return `${gridRowStart} / ${gridRowEnd}`;
};

const formatTime = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  };
  return new Date(dateString).toLocaleTimeString([], options).toUpperCase();
};

const StudyBlock: React.FC<{ block: StudyBlockType }> = ({ block }) => {
  const { start, end } = block;
  const [gridPosition, setGridPosition] = useState(timeToGridRow(start, end));
  const [currentEndTime, setCurrentEndTime] = useState(end ? formatTime(end) : 'In Progress');

  useEffect(() => {
    if (!end) {
      const timer = setInterval(() => {
        setGridPosition(timeToGridRow(start, undefined));
        setCurrentEndTime(formatTime(new Date().toISOString()));
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [start, end]);

  const startTime = formatTime(start);

  return (
    <li className="relative mt-px flex" style={{ gridRow: gridPosition }}>
      <div className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100">
        <p className="order-1 font-semibold text-blue-700">Session</p>
        <p className="text-blue-500 group-hover:text-blue-700">
          <time dateTime={start}>{startTime}</time>
          {' - '}
          <time>{currentEndTime}</time>
          {!end && <span className="ml-1 animate-pulse text-red-500">•</span>}
        </p>
      </div>
    </li>
  );
};

export default StudyBlock;
