import { startOfDay } from 'date-fns';

export const calculateGridPosition = (date: Date, zoomLevel: number): number => {
  const startOfToday = startOfDay(date);
  const minutesSinceMidnight = (date.getTime() - startOfToday.getTime()) / 60000;
  return Math.round((minutesSinceMidnight * (3.5 * zoomLevel)) / 60);
};
