'use client';

import { authClient } from '@/auth/client';

import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { SidebarMenuButton, useSidebar } from '../ui/sidebar';

export default function OrganizationSelect() {
  const { open: isSidebarOpen } = useSidebar();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  async function handleOrgChange(organizationId: string) {
    const { data, error } = await authClient.organization.setActive({
      organizationId,
    });

    if (error !== null) {
      console.error('Failed to set active organization:', error);
      return;
    }

    console.debug('Active organization set to:', data);
  }

  if (!isSidebarOpen) {
    return null;
  }

  if (!organizations || organizations.length === 0) {
    return null;
  }

  const currentOrg = activeOrg ?? organizations[0]!;

  return (
    <Select value={currentOrg.id} onValueChange={handleOrgChange}>
      <SidebarMenuButton asChild size="lg" className="h-auto w-full justify-between">
        <SelectTrigger className="cursor-pointer border-none shadow-none">
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">easyCron</span>
            <span className="text-muted-foreground truncate text-xs">{currentOrg.name}</span>
          </div>
        </SelectTrigger>
      </SidebarMenuButton>

      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id} className="cursor-pointer">
            <span className="text-xs">{org.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
