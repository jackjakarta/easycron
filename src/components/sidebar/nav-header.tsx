import { Clock } from 'lucide-react';
import Link from 'next/link';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '../ui/sidebar';

export default function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between">
        <SidebarMenuButton size="lg" asChild>
          <Link href="/dashboard">
            <div className="bg-background text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Clock className="size-5" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">easyCron</span>
              <span className="truncate text-xs">Jakarta Enterprise</span>
            </div>
          </Link>
        </SidebarMenuButton>
        <SidebarTrigger />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
