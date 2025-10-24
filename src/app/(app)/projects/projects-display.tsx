'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectsQuery } from '@/hooks/query/use-projects-query';
import { Calendar, ExternalLink, User } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsDisplay() {
  const { data: projects = [], isLoading, isError } = useProjectsQuery();

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
          <Link key={project.id} href={`/projects/${project.id}`} className="group">
            <Card className="border-border hover:border-primary/20 h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-foreground group-hover:text-primary line-clamp-1 text-lg font-semibold transition-colors">
                    {project.name}
                  </CardTitle>
                  <ExternalLink className="text-muted-foreground ml-2 h-4 w-4 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                {project.description && (
                  <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {project.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>Created {formatDate(project.createdAt)}</span>
                  </div>

                  {project.updatedAt &&
                    new Date(project.updatedAt).getTime() !==
                      new Date(project.createdAt).getTime() && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">
                          Updated {getTimeAgo(project.updatedAt)}
                        </span>
                        <Badge variant="outline" className="px-2 py-0.5 text-xs">
                          Recent
                        </Badge>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function getTimeAgo(date: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}
