'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useProjectsQuery } from '@/hooks/query/use-projects-query';
import { User } from 'lucide-react';

import ProjectCard from './project-card';

type ProjectsDisplayProps = {
  organizationId: string;
};

export default function ProjectsDisplay({ organizationId }: ProjectsDisplayProps) {
  const { data: projects = [], isLoading, isError } = useProjectsQuery({ organizationId });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-foreground text-2xl font-bold">Projects</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="bg-muted h-6 w-3/4 rounded"></div>
                <div className="bg-muted h-4 w-full rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-1/2 rounded"></div>
                  <div className="bg-muted h-4 w-1/3 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-foreground mb-2 text-2xl font-bold">Projects</h2>
        <p className="text-muted-foreground">Failed to load projects. Please try again.</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-foreground mb-4 text-2xl font-bold">Projects</h2>
        <div className="mx-auto max-w-md">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <User className="text-muted-foreground h-8 w-8" />
          </div>
          <p className="text-muted-foreground mb-2">No projects found</p>
          <p className="text-muted-foreground text-sm">Create your first project to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold">Projects</h2>
        <Badge variant="secondary" className="text-sm">
          {projects.length} {projects.length === 1 ? 'project' : 'projects'}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
