import { honoClient } from '@/app/api/client';
import { type ExecutionWithDetails } from '@/db/functions/execution';
import { useQuery } from '@tanstack/react-query';

import { type QueryOptions } from './types';

export function useRecentJobExecutionsQuery(options?: QueryOptions<ExecutionWithDetails[]>) {
  return useQuery<ExecutionWithDetails[]>({
    ...options,
    queryKey: ['recent-job-executions'],
    queryFn: fetchRecentExecutions,
  });
}

async function fetchRecentExecutions(): Promise<ExecutionWithDetails[]> {
  const response = await honoClient.api.recentExecutions.$get();

  if (!response.ok) {
    console.error(`Failed to fetch recent executions: ${response.statusText}`);
    throw new Error(`Failed to fetch recent executions: ${response.statusText}`);
  }

  const data = await response.json();

  const formated = data.map((execution) => ({
    ...execution,
    startedAt: new Date(execution.startedAt),
    finishedAt: execution.finishedAt ? new Date(execution.finishedAt) : null,
  }));

  return formated;
}
