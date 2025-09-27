'use client';

import { useProjectsQuery } from '@/hooks/query/use-projects-query';

export default function ProjectsDisplay() {
  const { data: projects } = useProjectsQuery();

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Projects</h2>
      <ul className="space-y-2">
        {projects?.map((project) => (
          <li key={project.id} className="rounded-lg border p-4 hover:bg-gray-50">
            <a href={`/projects/${project.id}`} className="text-blue-600 hover:underline">
              {project.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
