export const calculateGridPosition = (date: Date, zoomLevel: number): number => {
  const minutesSinceMidnight = date.getHours() * 60 + date.getMinutes();
  return Math.round((minutesSinceMidnight * (3.5 * zoomLevel)) / 60);
};
