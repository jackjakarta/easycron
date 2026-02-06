'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Shield, Users } from 'lucide-react';

import { type BetterAuthOrganization } from '../types';
import OrgHeader from './org-header';
import OrgInvitationsTable from './org-invitations-table';
import OrgMembersTable from './org-members-table';

export default function OrganizationOverview({
  org,
}: {
  org: NonNullable<BetterAuthOrganization>;
}) {
  const pendingInvitations = org.invitations.filter((i) => i.status === 'pending');
  const adminAndOwners = org.members.filter((m) => m.role === 'admin' || m.role === 'owner');

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-6 sm:p-8">
      <OrgHeader org={org} />

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
              <OrgMembersTable members={org.members} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <OrgInvitationsTable invitations={org.invitations} />
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
