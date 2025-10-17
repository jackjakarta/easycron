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
import { ChevronRight, Clock, Ellipsis, FolderPlus, SquaresUnite } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

import ProjectActionsDropdown from './project-actions-dropdown';

export default function NavMain() {
  const { data: projects = [], isLoading, isError } = useProjectsQuery();
  const skeletonSeeds = useSidebarSkeletons(2, 8);
  const t = useTranslations('sidebar');

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
          {t('quick-actions')}
        </SidebarGroupLabel>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={t('dashboard')}>
            <Link href="/dashboard">
              <SquaresUnite />
              <span>{t('dashboard')}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <CreateProjectDialog
            trigger={
              <SidebarMenuButton tooltip={t('create-project')} className="cursor-pointer">
                <FolderPlus />
                <span>{t('create-project')}</span>
              </SidebarMenuButton>
            }
          />
        </SidebarMenuItem>

        <SidebarGroupLabel className="mt-2 group-data-[collapsible=icon]:hidden">
          {t('latest')}
        </SidebarGroupLabel>
        <Collapsible asChild key="projects" defaultOpen={true}>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={t('projects.label')}>
              <Link href="/projects">
                <Clock />
                <span>{t('projects.label')}</span>
              </Link>
            </SidebarMenuButton>

            {isLoading &&
              skeletonSeeds.map((seed) => (
                <SidebarMenuSkeleton
                  className="group-data-[collapsible=icon]:hidden"
                  key={seed}
                  seed={seed}
                />
              ))}

            {isError && (
              <div className="text-destructive mt-2 ml-2 text-sm">{t('projects.error')}</div>
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
                    {projects.map((project) => (
                      <SidebarMenuSubItem key={project.id} className="group/sub">
                        <SidebarMenuSubButton asChild>
                          <Link href={`/projects/${project.id}`}>
                            <span>{project.name}</span>
                          </Link>
                        </SidebarMenuSubButton>

                        <ProjectActionsDropdown
                          project={project}
                          trigger={
                            <SidebarMenuAction className="invisible cursor-pointer group-hover/sub:visible data-[state=open]:visible">
                              <Ellipsis className="text-muted-foreground" />
                              <span className="sr-only">Project actions</span>
                            </SidebarMenuAction>
                          }
                        />
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
