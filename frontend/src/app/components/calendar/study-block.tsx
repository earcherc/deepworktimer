'use client';

import React, { useEffect, useState } from 'react';

type StudyBlockUI = Pick<StudyBlockType, 'title' | 'start' | 'end'>;

// Helper function to convert ISO date string to grid row start/end
const timeToGridRow = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Convert start and end times to the total minutes since midnight
  const startTotalMinutes = startDate.getUTCHours() * 60 + startDate.getUTCMinutes();
  const endTotalMinutes = endDate.getUTCHours() * 60 + endDate.getUTCMinutes();

  // Add 2 to adjust for the CSS grid-row being 1-indexed and the initial 1.75rem row
  const gridRowStart = startTotalMinutes + 2;
  const gridRowEnd = endTotalMinutes + 2;

  return `${gridRowStart} / ${gridRowEnd}`;
};

// Helper function to format date to local time string
const formatTime = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  };
  return new Date(dateString).toLocaleTimeString([], options).toUpperCase();
};

const StudyBlock = ({ block }: { block: StudyBlockUI }) => {
  const { title, start, end } = block;
  const [gridPosition, setGridPosition] = useState('');

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    // Calculate the grid position after the component mounts
    const newGridPosition = timeToGridRow(start, end);
    setGridPosition(newGridPosition);
  }, [start, end]);

  useEffect(() => {
    // Update the formatted times after the component mounts
    setStartTime(formatTime(start));
    setEndTime(formatTime(end));
  }, [start, end]); // Dependency array includes start and end to update if they change

  return (
    <li className="relative mt-px flex" style={{ gridRow: gridPosition }}>
      <div className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100">
        <p className="order-1 font-semibold text-blue-700">{title}</p>
        <p className="text-blue-500 group-hover:text-blue-700">
          <time dateTime={start} suppressHydrationWarning={true}>
            {startTime || 'Loading...'}
          </time>{' '}
          -{' '}
          <time dateTime={end} suppressHydrationWarning={true}>
            {endTime || 'Loading...'}
          </time>
        </p>
      </div>
    </li>
  );
};

export default StudyBlock;
