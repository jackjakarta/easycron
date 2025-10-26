export function formatDateToDayMonthYear(
  dateLike: Date | string | number,
  timeZone: string = 'Europe/Berlin',
  intl: string = 'de-DE',
): string {
  const d = dateLike instanceof Date ? dateLike : new Date(dateLike);

  return new Intl.DateTimeFormat(intl, {
    timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatDateToDayMonthYearTime(
  dateLike: Date | string | number,
  timeZone: string = 'Europe/Berlin',
  intl: string = 'de-DE',
): string {
  const d = dateLike instanceof Date ? dateLike : new Date(dateLike);

  return new Intl.DateTimeFormat(intl, {
    timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    minute: '2-digit',
    hour: '2-digit',
  }).format(d);
}

export function getTimeAgo(date: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}
