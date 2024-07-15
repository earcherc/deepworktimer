export function getTodayDateRange() {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return {
    start_time: startDate.toISOString().split('T')[0],
    end_time: endDate.toISOString().split('T')[0],
  };
}

export function getCurrentUTC(): string {
  return new Date().toISOString().slice(0, -1);
}

export function toLocalTime(dateString: string): Date {
  return new Date(dateString + 'Z');
}
