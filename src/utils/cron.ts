import parser from 'cron-parser';
import cronstrue from 'cronstrue';
import { z } from 'zod';

export const validCronSchema = z.string().refine(
  (val) => {
    try {
      cronstrue.toString(val);
      return true;
    } catch {
      return false;
    }
  },
  {
    message: 'Invalid cron expression',
  },
);

export function describeCronExpression(cron: string): string {
  try {
    const parsedCron = cronstrue.toString(cron);
    return parsedCron;
  } catch {
    return 'Invalid cron expression';
  }
}

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
