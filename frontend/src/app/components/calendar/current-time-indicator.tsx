'use client';

import React, { useEffect, useState } from 'react';

const CurrentTimeIndicator: React.FC = () => {
  const [position, setPosition] = useState(0);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updatePositionAndTime = () => {
      const now = new Date();
      const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
      const percentage = (minutesSinceMidnight / 1440) * 100; // 1440 minutes in a day
      setPosition(percentage);
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    const interval = setInterval(updatePositionAndTime, 30000); // Update every minute
    updatePositionAndTime(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute left-0 right-0 flex items-center pointer-events-none"
      style={{ top: `calc(${position}% - 10px)` }}
    >
      <div className="absolute left-14 w-2 h-2 rounded-full bg-red-500" />
      <div className="absolute left-14 right-0 h-px bg-red-500" />
      <span className="absolute left-20 text-xs text-red-500 font-medium">{currentTime}</span>
    </div>
  );
};

export default CurrentTimeIndicator;
