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
