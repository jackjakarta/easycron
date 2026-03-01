'use client';

import { authClient } from '@/auth/client';
import ConfirmationDialog from '@/components/common/confirmation-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { MoreHorizontal, Shield, ShieldOff, UserMinus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { type BetterAuthOrganization } from '../types';

type OrgMember = NonNullable<BetterAuthOrganization>['members'][number];

type OrgMembersTableProps = {
  members: OrgMember[];
  currentUserId: string;
  currentUserRole: string;
};

export default function OrgMembersTable({
  members,
  currentUserId,
  currentUserRole,
}: OrgMembersTableProps) {
  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin';

  const sorted = [...members].sort((a, b) => {
    const order = { owner: 0, admin: 1, member: 2 };
    return order[a.role] - order[b.role];
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="hidden sm:table-cell">Joined</TableHead>
          {canManage && <TableHead className="w-[50px]" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
            canManage={canManage}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function MemberRow({
  member,
  currentUserId,
  currentUserRole,
  canManage,
}: {
  member: OrgMember;
  currentUserId: string;
  currentUserRole: string;
  canManage: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isOwner = member.role === 'owner';
  const isSelf = member.userId === currentUserId;
  const isAdminTarget = member.role === 'admin';

  // Owners are protected, can't act on self, admins can only manage members
  const showActions =
    canManage && !isOwner && !isSelf && !(currentUserRole === 'admin' && isAdminTarget);

  async function handleChangeRole() {
    setIsLoading(true);
    const newRole = member.role === 'admin' ? 'member' : 'admin';

    const { error } = await authClient.organization.updateMemberRole({
      memberId: member.id,
      role: newRole,
    });

    if (error) {
      toast.error(error.message ?? 'Failed to update role');
    } else {
      toast.success(`Role changed to ${newRole}`);
      router.refresh();
    }

    setIsLoading(false);
  }

  async function handleRemoveMember() {
    setIsLoading(true);

    const { error } = await authClient.organization.removeMember({
      memberIdOrEmail: member.id,
    });

    if (error) {
      toast.error(error.message ?? 'Failed to remove member');
    } else {
      toast.success('Member removed');
      router.refresh();
    }

    setIsLoading(false);
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {member.user.image && (
              <AvatarImage src={member.user.image || '/placeholder.svg'} alt={member.user.name} />
            )}
            <AvatarFallback className="text-xs">{getInitials(member.user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-foreground truncate text-sm font-medium">{member.user.name}</p>
            <p className="text-muted-foreground truncate text-xs">{member.user.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={roleBadgeVariant[member.role]} className="capitalize">
          {member.role}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground hidden sm:table-cell">
        {formatDate(member.createdAt)}
      </TableCell>
      {canManage && (
        <TableCell>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleChangeRole} disabled={isLoading}>
                  {member.role === 'admin' ? (
                    <>
                      <ShieldOff className="size-4" />
                      Change to Member
                    </>
                  ) : (
                    <>
                      <Shield className="size-4" />
                      Change to Admin
                    </>
                  )}
                </DropdownMenuItem>

                <ConfirmationDialog
                  trigger={
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <UserMinus className="text-destructive size-4" />
                      Remove Member
                    </DropdownMenuItem>
                  }
                  title="Remove Member"
                  description={`Are you sure you want to remove ${member.user.name} from this organization? They will lose access to all organization resources.`}
                  type="destructive"
                  onConfirm={handleRemoveMember}
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

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

const roleBadgeVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  owner: 'default',
  admin: 'secondary',
  member: 'outline',
};
