import { type ProjectWithJobs } from '@/db/functions/project';
import { betterFetch } from '@better-fetch/fetch';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export function useProjectsQuery(
  options?: Omit<UseQueryOptions<ProjectWithJobs[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<ProjectWithJobs[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    ...options,
  });
}

async function fetchProjects() {
  const { data: projects, error } = await betterFetch<ProjectWithJobs[]>('/api/projects', {
    cache: 'no-store',
  });

  if (error !== null) {
    console.error(`Failed to fetch projects: ${error.message}`);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return Array.isArray(projects) ? projects : [];
}
