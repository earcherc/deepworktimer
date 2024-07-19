'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const TimeReset = ({ currentDate, onClick }: { currentDate: Date | null, onClick: () => void }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      if (currentDate) {
        setTime(format(currentDate, 'h:mm a'));
      }
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, [currentDate]);

  if (!currentDate) return null;

  return (
    <button
      onClick={onClick}
      className="px-2 py-px rounded bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100"
      title="Scroll to current time"
    >
      {time}
    </button>
  );
};

export default TimeReset;