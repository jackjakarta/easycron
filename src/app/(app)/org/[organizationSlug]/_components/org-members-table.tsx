import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

type OrgMember = NonNullable<BetterAuthOrganization>['members'][number];

export default function OrgMembersTable({ members }: { members: OrgMember[] }) {
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {member.user.image && (
                    <AvatarImage
                      src={member.user.image || '/placeholder.svg'}
                      alt={member.user.name}
                    />
                  )}
                  <AvatarFallback className="text-xs">
                    {getInitials(member.user.name)}
                  </AvatarFallback>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
