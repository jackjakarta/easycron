import { env } from '@/env';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

import { validCronSchema } from './cron';

const openai = createOpenAI({
  apiKey: env.openaiApiKey,
});

const cronExpressionSchema = z.object({
  cronExpression: validCronSchema,
});

export async function generateCronExpression(task: string) {
  const { object } = await generateObject({
    model: openai('gpt-4.1-nano'),
    system: `You are a helpful assistant that generates cron expressions based on user input.`,
    prompt: `Generate a cron expression from this input: "${task}". The cron expression should be in the standard format and should not include any additional text or explanation.`,
    schema: cronExpressionSchema,
    maxRetries: 3,
    temperature: 0.2,
  });

  return object;
}
