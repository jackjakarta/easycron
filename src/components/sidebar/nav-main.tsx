'use client';

import CreateProjectDialog from '@/app/(app)/projects/create-project-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useProjectsQuery } from '@/hooks/query/use-projects-query';
import { useSidebarSkeletons } from '@/hooks/use-sidebar-skeletons';
import { ChevronRight, Clock, FolderPlus, SquaresUnite } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function NavMain() {
  const { data: projects = [], isLoading, isError } = useProjectsQuery();
  const skeletonSeeds = useSidebarSkeletons(2, 8);

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Recent Jobs">
            <Link href="/dashboard">
              <SquaresUnite />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <CreateProjectDialog
            trigger={
              <SidebarMenuButton tooltip="New Project" className="cursor-pointer">
                <FolderPlus />
                <span>New Project</span>
              </SidebarMenuButton>
            }
          />
        </SidebarMenuItem>
        <SidebarGroupLabel className="mt-2">Latest</SidebarGroupLabel>
        <Collapsible asChild key="projects" defaultOpen={true}>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Projects">
              <Link href="/projects">
                <Clock />
                <span>Projects</span>
              </Link>
            </SidebarMenuButton>

            {isLoading &&
              skeletonSeeds.map((seed) => <SidebarMenuSkeleton key={seed} seed={seed} />)}

            {isError && (
              <div className="text-destructive mt-2 ml-2 text-sm">Error fetching projects</div>
            )}

            {!isLoading && !isError && projects.length > 0 && (
              <>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="cursor-pointer data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {projects.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.id}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/projects/${subItem.id}`}>
                            <span>{subItem.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </>
            )}
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
