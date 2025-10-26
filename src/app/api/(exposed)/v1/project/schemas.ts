import { z } from 'zod';

export const postRequestSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
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
    name: z.string().optional(),
    description: z.string().optional().nullable(),
  })
  .strict();

export const deleteRequestSchema = z.object({
  projectId: z.uuid(),
});
