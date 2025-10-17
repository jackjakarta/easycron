import { type ExecutionWithDetails } from '@/db/functions/execution';
import { betterFetch } from '@better-fetch/fetch';
import { useQuery } from '@tanstack/react-query';

import { type QueryOptions } from './types';

type JobExecutionQueryOptions = QueryOptions<ExecutionWithDetails[]>;

export function useRecentJobExecutionsQuery(options?: JobExecutionQueryOptions) {
  return useQuery<ExecutionWithDetails[]>({
    ...options,
    queryKey: ['recent-job-executions'],
    queryFn: fetchRecentExecutions,
  });
}

async function fetchRecentExecutions(): Promise<ExecutionWithDetails[]> {
  const { data: jobExecutions, error } = await betterFetch<ExecutionWithDetails[]>(
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
