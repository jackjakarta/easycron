import { z } from 'zod';

export const postRequestSchema = z
  .object({
    name: z.string().nonempty(),
    description: z
      .string()
      .nonempty({ message: 'Description cannot be empty if provided' })
      .optional()
      .nullable(),
  })
  .strict();

export const putRequestSchema = z
  .object({
    projectId: z.uuid(),
    name: z.string().nonempty().optional(),
    description: z
      .string()
      .nonempty({ message: 'Description cannot be empty if provided' })
      .optional()
      .nullable(),
  })
  .strict();
