'use client';

import { formatToLocalTime } from '@utils/dateUtils';
import React, { useEffect, useState } from 'react';

const CurrentTimeIndicator: React.FC = () => {
  const [position, setPosition] = useState(0);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updatePositionAndTime = () => {
      const now = new Date();
      const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
      const percentage = (minutesSinceMidnight / 1440) * 100;
      setPosition(percentage);
      setCurrentTime(formatToLocalTime(now, 'HH:mm'));
    };

    const interval = setInterval(updatePositionAndTime, 30000);
    updatePositionAndTime();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute left-0 right-0 flex items-center pointer-events-none" style={{ top: `${position}%` }}>
      <div className="absolute left-14 w-2 h-2 rounded-full -ml-1 bg-red-300" />
      <div className="absolute left-14 right-0 h-px bg-red-300" />
      <span className="absolute left-20 text-xs -ml-16 text-red-500 opacity-50 font-medium">{currentTime}</span>
    </div>
  );
};

export default CurrentTimeIndicator;
