import { z } from 'zod';

export const subscriptionTypeSchema = z.enum(['monthly', 'yearly']);
