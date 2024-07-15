import { startOfDay } from 'date-fns';

export const calculateGridPosition = (date: Date): number => {
  const startOfToday = startOfDay(date);
  const minutesSinceMidnight = (date.getTime() - startOfToday.getTime()) / 60000;
  return (minutesSinceMidnight / 1440) * 100;
};
