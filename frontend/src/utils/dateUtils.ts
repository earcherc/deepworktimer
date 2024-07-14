export function getTodayDateRange() {
  const now = new Date();
  const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

  return {
    start_time: startDate.toISOString().split('T')[0],
    end_time: endDate.toISOString().split('T')[0],
  };
}

export function getCurrentUTC(): string {
  return new Date().toISOString().slice(0, -1);
}
