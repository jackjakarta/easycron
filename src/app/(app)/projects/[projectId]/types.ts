import { type JobModel } from '@/db/schema';

export type StripedCronJob = Pick<
  JobModel,
  'id' | 'name' | 'enabled' | 'scheduleCron' | 'timezone' | 'httpMethod' | 'lastRunAt' | 'nextRunAt'
>;
