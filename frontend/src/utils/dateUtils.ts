import { endOfDay, formatISO, parseISO, startOfDay } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

export function getTodayDateRange() {
  const now = new Date();
  const startDate = startOfDay(now);
  const endDate = endOfDay(now);
  return {
    start_time: formatISO(startDate),
    end_time: formatISO(endDate),
  };
}

export function getCurrentUTC(): string {
  return formatISO(new Date());
}

export function toLocalTime(dateString: string): Date {
  const parsedDate = parseISO(dateString);
  return toZonedTime(parsedDate, Intl.DateTimeFormat().resolvedOptions().timeZone);
}

export function toUTC(localDate: Date): string {
  return formatInTimeZone(localDate, 'UTC', "yyyy-MM-dd'T'HH:mm:ss'Z'");
}

export function formatToLocalTime(date: Date, formatString: string = 'yyyy-MM-dd HH:mm:ss'): string {
  return formatInTimeZone(date, Intl.DateTimeFormat().resolvedOptions().timeZone, formatString);
}
