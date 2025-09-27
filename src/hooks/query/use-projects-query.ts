import { type ProjectModel } from '@/db/schema';
import { betterFetch } from '@better-fetch/fetch';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export function useProjectsQuery(
  options?: Omit<UseQueryOptions<ProjectModel[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<ProjectModel[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    ...options,
  });
}

async function fetchProjects() {
  const { data: projects, error } = await betterFetch<ProjectModel[]>('/api/projects', {
    cache: 'no-store',
  });

  if (error !== null) {
    console.error(`Failed to fetch projects: ${error.message}`);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return Array.isArray(projects) ? projects : [];
}
