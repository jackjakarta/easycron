'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ProjectModel } from '@/db/schema';
import { formatDateToDayMonthYear, getTimeAgo } from '@/utils/date';
import { Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ProjectCard({ project }: { project: ProjectModel }) {
  return (
    <Link href={`/projects/${project.id}`} className="group">
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
              <span>Created {formatDateToDayMonthYear(project.createdAt)}</span>
            </div>

            {project.updatedAt &&
              new Date(project.updatedAt).getTime() !== new Date(project.createdAt).getTime() && (
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
  );
}
