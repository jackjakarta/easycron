import { type ExecutionModel } from '@/db/schema';
import { betterFetch } from '@better-fetch/fetch';
import { useQuery } from '@tanstack/react-query';

import { type QueryOptions } from './types';

type JobExecutionQueryOptions = QueryOptions<ExecutionModel[]> & { jobId: string };

export function useJobExecutionsQuery(options: JobExecutionQueryOptions) {
  return useQuery<ExecutionModel[]>({
    ...options,
    queryKey: ['job-executions', options.jobId],
    queryFn: () => fetchJobExecutions(options.jobId),
  });
}

async function fetchJobExecutions(jobId: string): Promise<ExecutionModel[]> {
  const urlParams = new URLSearchParams({ jobId });
  const endpoint = `/api/executions?${urlParams.toString()}`;

  const { data: jobExecutions, error } = await betterFetch<ExecutionModel[]>(endpoint, {
    cache: 'no-store',
  });

  if (error !== null) {
    console.error(`Failed to fetch job executions: ${error.message}`);
    throw new Error(`Failed to fetch job executions: ${error.message}`);
  }

  return Array.isArray(jobExecutions) ? jobExecutions : [];
}
