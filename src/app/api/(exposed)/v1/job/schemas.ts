import { validCronSchema } from '@/utils/cron';
import { z } from 'zod';

export const requestBodySchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
    url: z.url('Invalid URL').max(2000, 'URL must be at most 2000 characters'),
    httpMethod: z.enum(['GET', 'POST']),
    scheduleCron: validCronSchema,
    timezone: z
      .string()
      .min(1, 'Timezone is required')
      .max(100, 'Timezone must be at most 100 characters'),
    body: z.string().max(5000, 'Body must be at most 5000 characters').optional(),
    enabled: z.boolean().optional(),
    projectId: z.uuid(),
    headers: z.array(
      z.object({
        k: z
          .string()
          .min(1, 'Header name is required')
          .max(200, 'Header name must be at most 200 characters'),
        v: z.string().max(1000, 'Header value must be at most 1000 characters'),
      }),
    ),
  })
  .strict();
