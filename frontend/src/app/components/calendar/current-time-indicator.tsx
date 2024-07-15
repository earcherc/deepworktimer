// current-time-indicator.tsx
import { calculateGridPosition } from '@utils/timeUtils';
import React, { useEffect, useState } from 'react';

interface CurrentTimeIndicatorProps {
  zoomLevel: number;
}

const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ zoomLevel }) => {
  const [position, setPosition] = useState(calculateGridPosition(new Date(), 1));

  useEffect(() => {
    const updatePosition = () => {
      setPosition(calculateGridPosition(new Date(), 1));
    };

    const interval = setInterval(updatePosition, 60000); // Update every minute
    updatePosition(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute left-0 right-0 h-0.5 bg-red-500 z-10" style={{ top: `${position * zoomLevel}px` }}>
      <div className="absolute -left-2 -top-1 w-2 h-2 rounded-full bg-red-500" />
    </div>
  );
};

export default CurrentTimeIndicator;
