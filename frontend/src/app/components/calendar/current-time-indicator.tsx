'use client';

import { useTimeManagement } from '@hooks/useTimeManagement';
import { formatToLocalTime } from '@utils/dateUtils';
import React, { useEffect, useState } from 'react';

const CurrentTimeIndicator: React.FC = () => {
  const { currentTime } = useTimeManagement();
  const [position, setPosition] = useState(0);
  const [displayTime, setDisplayTime] = useState('');

  useEffect(() => {
    if (currentTime) {
      const minutesSinceMidnight = currentTime.getHours() * 60 + currentTime.getMinutes();
      const percentage = (minutesSinceMidnight / 1440) * 100;
      setPosition(percentage);
      setDisplayTime(formatToLocalTime(currentTime, 'h:mm'));
    }
  }, [currentTime]);

  if (!currentTime) return null;

  return (
    <div 
      className="absolute left-0 right-0 flex items-center pointer-events-none z-20" 
      style={{ top: `${position}%` }}
    >
      <div className="absolute left-14 w-2 h-2 rounded-full -ml-1 bg-red-400 dark:bg-red-600" />
      <div className="absolute left-14 right-0 h-px bg-red-400 dark:bg-red-600" />
      <span className="absolute left-20 text-xs -ml-16 text-red-400 dark:text-red-600 font-medium">
        {displayTime}
      </span>
    </div>
  );
};

export default CurrentTimeIndicator;