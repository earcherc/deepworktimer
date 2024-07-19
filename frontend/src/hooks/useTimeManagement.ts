// hooks/useTimeManagement.ts
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

export const useTimeManagement = (initialDate: Date | null = new Date()) => {
  const [currentTime, setCurrentTime] = useState(initialDate);

  const updateCurrentTime = useCallback(() => {
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleUpdate = () => {
      const now = new Date();
      const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

      timeoutId = setTimeout(() => {
        updateCurrentTime();
        scheduleUpdate();
      }, delay);
    };

    updateCurrentTime();
    scheduleUpdate();

    const intervalId = setInterval(() => {
      const now = new Date();
      if (now.getSeconds() === 0) {
        updateCurrentTime();
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [updateCurrentTime]);

  const formattedTime = currentTime ? format(currentTime, 'h:mm a') : '';

  return { currentTime, formattedTime, updateCurrentTime };
};