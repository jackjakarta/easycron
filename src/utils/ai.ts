import { env } from '@/env';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const openai = createOpenAI({
  apiKey: env.openaiApiKey,
});

const cronExpressionSchema = z.object({
  cronExpression: z.string(),
});

export async function generateCronExpression(task: string) {
  const { object } = await generateObject({
    model: openai('gpt-4.1-nano'),
    schema: cronExpressionSchema,
    prompt: `Generate a cron expression from this input: "${task}". The cron expression should be in the standard format (minute, hour, day of month, month, day of week) and should not include any additional text or explanation.`,
    maxRetries: 3,
    temperature: 0.1,
  });

  return object;
}
