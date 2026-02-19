import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatRelativeTime(dateString: string): string {
  const date = dayjs(dateString);
  const now = dayjs();

  // Use relative time for recent dates (within 7 days)
  if (now.diff(date, 'day') < 7) {
    return date.from(now);
  }

  // Fallback to formatted date for older dates
  const format =
    date.year() !== now.year() ? 'MMM D, YYYY' : 'MMM D';
  return date.format(format);
}
