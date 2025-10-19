'use client';

import Link from 'next/link';

import { ThemeToggle } from '../common/theme-toggle';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar';

export default function NavHeader() {
  const { open: isSidebarOpen } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between">
        {isSidebarOpen && (
          <SidebarMenuButton size="lg" asChild>
            <Link href="/dashboard">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">easyCron</span>
                <span className="truncate text-xs">Personal Account</span>
              </div>
            </Link>
          </SidebarMenuButton>
        )}
        <div className="ml-0.5">
          <ThemeToggle />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
