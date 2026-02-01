import { honoClient } from '@/app/api/client';
import { type ProjectModel } from '@/db/schema';
import { useQuery } from '@tanstack/react-query';

import { type QueryOptions } from './types';

export function useProjectsQuery(options: QueryOptions<ProjectModel[]> & { userId: string }) {
  return useQuery<ProjectModel[]>({
    ...options,
    queryKey: ['projects', options.userId],
    queryFn: fetchProjects,
  });
}

async function fetchProjects(): Promise<ProjectModel[]> {
  const response = await honoClient.api.projects.$get();

  if (!response.ok) {
    console.error(`Failed to fetch projects: ${response.statusText}`);
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
  }

  const data = await response.json();

  const formated = data.map((project) => ({
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  }));

  return formated;
}
