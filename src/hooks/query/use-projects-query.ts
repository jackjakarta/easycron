import { type ProjectModel } from '@/db/schema';
import { betterFetch } from '@better-fetch/fetch';
import { useQuery } from '@tanstack/react-query';

import { type QueryOptions } from './types';

export function useProjectsQuery(options?: QueryOptions<ProjectModel[]>) {
  return useQuery<ProjectModel[]>({
    ...options,
    queryKey: ['projects'],
    queryFn: fetchProjects,
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

  return projects;
}
