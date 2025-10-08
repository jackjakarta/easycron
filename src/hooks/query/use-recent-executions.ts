import { type ExecutionModel } from '@/db/schema';
import { betterFetch } from '@better-fetch/fetch';
import { useQuery } from '@tanstack/react-query';

import { type QueryOptions } from './types';

type JobExecutionQueryOptions = QueryOptions<ExecutionModel[]>;

export function useRecentJobExecutionsQuery(options?: JobExecutionQueryOptions) {
  return useQuery<ExecutionModel[]>({
    ...options,
    queryKey: ['recent-job-executions'],
    queryFn: fetchRecentExecutions,
  });
}

async function fetchRecentExecutions(): Promise<ExecutionModel[]> {
  const { data: jobExecutions, error } = await betterFetch<ExecutionModel[]>(
    '/api/recent-executions',
    {
      cache: 'no-store',
    },
  );

  if (error !== null) {
    console.error(`Failed to fetch job executions: ${error.message}`);
    throw new Error(`Failed to fetch job executions: ${error.message}`);
  }

  return Array.isArray(jobExecutions) ? jobExecutions : [];
}
