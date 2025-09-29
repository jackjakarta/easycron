'use client';

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
import { ChevronRight, Clock, FolderPlus } from 'lucide-react';
import Link from 'next/link';

export default function NavMain() {
  const { data: projects = [], isLoading, isError } = useProjectsQuery();

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="New Job" className="cursor-pointer">
            <FolderPlus />
            <span>New Project</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarGroupLabel className="mt-2">Latest</SidebarGroupLabel>
        <Collapsible key="projects" defaultOpen={true} asChild>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Projects">
              <Link href="/projects">
                <Clock />
                <span>Projects</span>
              </Link>
            </SidebarMenuButton>

            {isLoading &&
              Array.from({ length: 8 }).map((_, index) => <SidebarMenuSkeleton key={index} />)}

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
