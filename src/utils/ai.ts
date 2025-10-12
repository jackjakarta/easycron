import { env } from '@/env';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

import { validCronSchema } from './cron';

const SYSTEM_PROMPT = `You're only role is to generate cron expressions based natural language descriptions.

Here are some examples of user input and the corresponding cron expressions:

- * * * * * - Runs every minute
- */5 * * * * - Runs every 5 minutes
- */15 * * * * - Runs every 15 minutes
- 0 * * * * - Runs at the top of every hour
- 0 */2 * * * - Runs every 2 hours
- 0 0 * * * - Runs every day at midnight
- 30 6 * * * - Runs every day at 6:30 AM
- 0 8 * * 1 - Runs every Monday at 8:00 AM
- 0 9 * * 1-5 - Runs Monday through Friday at 9:00 AM
- 0 17 * * 0 - Runs every Sunday at 5:00 PM
- 0 0 1 * * - Runs on the 1st of every month
- 0 12 15 * * - Runs on the 15th of every month at noon
- 0 0 1 */3 * - Runs quarterly at midnight on the 1st
- 1 0 1 1 * - Runs every year on January 1st at 12:01 AM
- */10 9-17 * * 1-5 - Runs every 10 minutes during working hours
- */30 18-23 * * * - Runs every 30 minutes in the evening
- * * 1,15 * * - Runs every minute on the 1st and 15th
- 0 3 */2 * * - Runs every 2 days at 3 AM
`;

const openai = createOpenAI({
  apiKey: env.openaiApiKey,
});

const cronExpressionSchema = z.object({
  cronExpression: validCronSchema,
});

export async function generateCronExpression(task: string) {
  const { object } = await generateObject({
    model: openai('gpt-4.1-nano'),
    system: SYSTEM_PROMPT,
    prompt: `Generate a cron expression from this input: "${task}". The cron expression should be in the standard format and should not include any additional text or explanation.`,
    schema: cronExpressionSchema,
    maxRetries: 3,
    temperature: 0.1,
  });

  return object;
}
