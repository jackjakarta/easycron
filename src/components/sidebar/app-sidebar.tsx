'use client';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { type UserModel } from '@/db/schema';
import React from 'react';

import NavHeader from './nav-header';
import NavMain from './nav-main';
import NavSecondary from './nav-secondary';
import NavUser from './nav-user';

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: UserModel;
};

export default function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
