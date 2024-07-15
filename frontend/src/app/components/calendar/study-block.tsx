// study-block.tsx
'use client';
import { toLocalTime } from '../../../utils/dateUtils';
import { StudyBlock as StudyBlockType } from '@api';
import React, { useEffect, useState } from 'react';

const timeToGridRow = (start: string, end: string | undefined): string => {
  const startDate = toLocalTime(start);
  const endDate = end ? toLocalTime(end) : new Date();
  const startTotalMinutes = (startDate.getHours() * 60 + startDate.getMinutes()) % 1440;
  const endTotalMinutes = (endDate.getHours() * 60 + endDate.getMinutes()) % 1440;
  const gridRowStart = startTotalMinutes + 2;
  const gridRowEnd = endTotalMinutes + 2;
  console.log(`Grid row: ${gridRowStart} / ${gridRowEnd} for start: ${start}, end: ${end}`);
  return `${gridRowStart} / ${gridRowEnd}`;
};

const formatTime = (dateString: string) => {
  const date = toLocalTime(dateString);
  return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const StudyBlockComponent: React.FC<{ block: StudyBlockType }> = ({ block }) => {
  const { start_time, end_time, is_countdown } = block;
  const [gridPosition, setGridPosition] = useState(timeToGridRow(start_time, end_time));
  const [currentEndTime, setCurrentEndTime] = useState(end_time ? formatTime(end_time) : 'In Progress');

  useEffect(() => {
    console.log(`StudyBlock: start_time: ${start_time}, end_time: ${end_time}, is_countdown: ${is_countdown}`);
    if (!end_time) {
      const timer = setInterval(() => {
        const now = new Date();
        const newPosition = timeToGridRow(start_time, now.toISOString());
        const newEndTime = formatTime(now.toISOString());
        console.log(`Updating ongoing study block: new position: ${newPosition}, new end time: ${newEndTime}`);
        setGridPosition(newPosition);
        setCurrentEndTime(newEndTime);
      }, 60000); // Update every minute
      return () => clearInterval(timer);
    }
  }, [start_time, end_time]);

  const startTime = formatTime(start_time);

  return (
    <li className="relative mt-px flex" style={{ gridRow: gridPosition }}>
      <div className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100">
        <p className="order-1 font-semibold text-blue-700">{is_countdown ? 'Countdown' : 'Session'}</p>
        <p className="text-blue-500 group-hover:text-blue-700">
          <time dateTime={start_time}>{startTime}</time>
          {' - '}
          <time>{currentEndTime}</time>
          {!end_time && <span className="ml-1 animate-pulse text-red-500">•</span>}
        </p>
      </div>
    </li>
  );
};

export default StudyBlockComponent;
