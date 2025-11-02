'use client';

import { authClient } from '@/auth/client';

import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { SidebarMenuButton, useSidebar } from '../ui/sidebar';

export default function OrganizationSelect() {
  const { open: isSidebarOpen } = useSidebar();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: organizations = [] } = authClient.useListOrganizations();

  async function handleOrgClick(organizationId: string | null) {
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

  return (
    <Select
      value={activeOrg?.id || 'personal'}
      onValueChange={(value) => {
        const organizationId = value === 'personal' ? null : value;
        handleOrgClick(organizationId);
      }}
    >
      <SidebarMenuButton asChild size="lg" className="h-auto w-full justify-between">
        <SelectTrigger className="border-none bg-red-500">
          <div className="leading-tightb grid flex-1 text-left text-sm">
            <span className="truncate font-medium">easyCron</span>
            <span className="text-muted-foreground truncate text-xs">
              {activeOrg?.name || 'Personal Account'}
            </span>
          </div>
        </SelectTrigger>
      </SidebarMenuButton>

      <SelectContent>
        <SelectItem value="personal">
          <span className="text-xs">Personal Account</span>
        </SelectItem>
        {organizations?.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            <span className="text-xs">{org.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
