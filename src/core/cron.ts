import parser from 'cron-parser';

/** Normalize run time to second precision to avoid drift noise. */
export function now(): Date {
  const d = new Date();
  d.setMilliseconds(0);
  return d;
}

export function computeNextRun(cronExpr: string, tz: string, from: Date): Date {
  try {
    const it = parser.parse(cronExpr, { tz, currentDate: from });
    const value = it.next();
    return value.toDate();
  } catch (err) {
    throw new Error(`Invalid cron (${cronExpr}) or timezone (${err}`);
  }
}
