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
