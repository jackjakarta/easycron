import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { type BetterAuthOrganization } from '../types';

type OrgInvitation = NonNullable<BetterAuthOrganization>['invitations'][number];
type InvitationStatus = OrgInvitation['status'];

export default function OrgInvitationsTable({ invitations }: { invitations: OrgInvitation[] }) {
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => {
          const status = statusStyles[invitation.status];
          return (
            <TableRow key={invitation.id}>
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
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
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
