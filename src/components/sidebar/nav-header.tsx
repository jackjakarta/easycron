'use client';

import { Link } from 'lucide-react';

import { ThemeToggle } from '../common/theme-toggle';
import { SidebarMenu, SidebarMenuItem } from '../ui/sidebar';
import OrganizationSelect from './organization-select';

export default function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between">
        <OrganizationSelect />
        <div className="ml-0.5">
          <ThemeToggle />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
