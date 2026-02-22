import { type ExecutionHourlyStats } from '@/db/functions/execution-analytics';
import { betterFetch } from '@better-fetch/fetch';
import { useQuery } from '@tanstack/react-query';

import { type QueryOptions } from './types';

type ExecutionAnalyticsQueryOptions = QueryOptions<ExecutionHourlyStats[]> & { jobId: string };

export function useExecutionAnalyticsQuery(options: ExecutionAnalyticsQueryOptions) {
  return useQuery<ExecutionHourlyStats[]>({
    ...options,
    queryKey: ['execution-analytics', options.jobId],
    queryFn: () => fetchExecutionAnalytics(options.jobId),
    refetchInterval: options.refetchInterval ?? 5 * 60 * 1000,
  });
}

async function fetchExecutionAnalytics(jobId: string): Promise<ExecutionHourlyStats[]> {
  const urlParams = new URLSearchParams({ jobId });
  const endpoint = `/api/execution-analytics?${urlParams.toString()}`;

  const { data, error } = await betterFetch<ExecutionHourlyStats[]>(endpoint, {
    cache: 'no-store',
  });

  if (error !== null) {
    console.error(`Failed to fetch execution analytics: ${error.message}`);
    throw new Error(`Failed to fetch execution analytics: ${error.message}`);
  }

  return Array.isArray(data) ? data : [];
}
