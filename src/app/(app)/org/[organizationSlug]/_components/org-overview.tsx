'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Shield, Users } from 'lucide-react';

import { type BetterAuthOrganization } from '../types';
import InviteMemberDialog from './invite-member-dialog';
import OrgHeader from './org-header';
import OrgInvitationsTable from './org-invitations-table';
import OrgMembersTable from './org-members-table';

export default function OrganizationOverview({
  org,
  currentUserId,
}: {
  org: NonNullable<BetterAuthOrganization>;
  currentUserId: string;
}) {
  const pendingInvitations = org.invitations.filter((i) => i.status === 'pending');
  const adminAndOwners = org.members.filter((m) => m.role === 'admin' || m.role === 'owner');

  const currentMember = org.members.find((m) => m.userId === currentUserId);
  const currentUserRole = currentMember?.role ?? 'member';
  const canManageMembers = currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <OrgHeader org={org} />
        {canManageMembers && <InviteMemberDialog organizationId={org.id} />}
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Members" value={org.members.length} icon={Users} />
        <StatCard label="Admins & Owners" value={adminAndOwners.length} icon={Shield} />
        <StatCard label="Pending Invitations" value={pendingInvitations.length} icon={Mail} />
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members" className="cursor-pointer">
            Members ({org.members.length})
          </TabsTrigger>
          <TabsTrigger value="invitations" className="cursor-pointer">
            Invitations ({org.invitations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organization Members</CardTitle>
            </CardHeader>
            <CardContent>
              <OrgMembersTable
                members={org.members}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <OrgInvitationsTable
                invitations={org.invitations}
                canManageMembers={canManageMembers}
                organizationId={org.id}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <Icon className="text-muted-foreground h-5 w-5" />
        </div>
        <div>
          <p className="text-foreground text-2xl font-bold">{value}</p>
          <p className="text-muted-foreground text-xs">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
