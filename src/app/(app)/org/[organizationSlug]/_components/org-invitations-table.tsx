'use client';

import { authClient } from '@/auth/client';
import ConfirmationDialog from '@/components/common/confirmation-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, RotateCw, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { type BetterAuthOrganization } from '../types';

type OrgInvitation = NonNullable<BetterAuthOrganization>['invitations'][number];
type InvitationStatus = OrgInvitation['status'];

type OrgInvitationsTableProps = {
  invitations: OrgInvitation[];
  canManageMembers: boolean;
  organizationId: string;
};

export default function OrgInvitationsTable({
  invitations,
  canManageMembers,
  organizationId,
}: OrgInvitationsTableProps) {
  if (invitations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <p className="text-muted-foreground text-sm">No invitations yet</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Invite people to join this organization
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden sm:table-cell">Expires</TableHead>
          {canManageMembers && <TableHead className="w-[50px]" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <InvitationRow
            key={invitation.id}
            invitation={invitation}
            canManageMembers={canManageMembers}
            organizationId={organizationId}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function InvitationRow({
  invitation,
  canManageMembers,
  organizationId,
}: {
  invitation: OrgInvitation;
  canManageMembers: boolean;
  organizationId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const status = statusStyles[invitation.status];
  const isPending = invitation.status === 'pending';

  async function handleCancelInvitation() {
    setIsLoading(true);

    const { error } = await authClient.organization.cancelInvitation({
      invitationId: invitation.id,
    });

    if (error) {
      toast.error(error.message ?? 'Failed to cancel invitation');
    } else {
      toast.success('Invitation canceled');
      router.refresh();
    }

    setIsLoading(false);
  }

  async function handleResendInvitation() {
    setIsLoading(true);

    const { error } = await authClient.organization.inviteMember({
      email: invitation.email,
      role: invitation.role as 'member' | 'admin',
      organizationId,
      resend: true,
    });

    if (error) {
      toast.error(error.message ?? 'Failed to resend invitation');
    } else {
      toast.success('Invitation resent');
    }

    setIsLoading(false);
  }

  return (
    <TableRow>
      <TableCell>
        <span className="text-foreground text-sm font-medium">{invitation.email}</span>
      </TableCell>
      <TableCell>
        <Badge variant={roleBadgeVariant[invitation.role]} className="capitalize">
          {invitation.role}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={status.variant}>{status.label}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground hidden sm:table-cell">
        {formatDate(invitation.expiresAt)}
      </TableCell>
      {canManageMembers && (
        <TableCell>
          {isPending && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleResendInvitation} disabled={isLoading}>
                  <RotateCw className="size-4" />
                  Resend
                </DropdownMenuItem>

                <ConfirmationDialog
                  trigger={
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <XCircle className="text-destructive size-4" />
                      Cancel Invitation
                    </DropdownMenuItem>
                  }
                  title="Cancel Invitation"
                  description={`Are you sure you want to cancel the invitation to ${invitation.email}? They will no longer be able to join using this invitation.`}
                  type="destructive"
                  onConfirm={handleCancelInvitation}
                  isLoading={isLoading}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TableCell>
      )}
    </TableRow>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

const statusStyles: Record<
  InvitationStatus,
  { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
> = {
  pending: { variant: 'outline', label: 'Pending' },
  accepted: { variant: 'default', label: 'Accepted' },
  rejected: { variant: 'destructive', label: 'Rejected' },
  canceled: { variant: 'secondary', label: 'Canceled' },
};

const roleBadgeVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  owner: 'default',
  admin: 'secondary',
  member: 'outline',
};
