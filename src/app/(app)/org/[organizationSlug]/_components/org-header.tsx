import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Globe, Users } from 'lucide-react';

import { type BetterAuthOrganization } from '../types';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export default function OrgHeader({ org }: { org: NonNullable<BetterAuthOrganization> }) {
  const ownerCount = org.members.filter((m) => m.role === 'owner').length;
  const adminCount = org.members.filter((m) => m.role === 'admin').length;
  const memberCount = org.members.filter((m) => m.role === 'member').length;

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <Avatar className="h-16 w-16 rounded-lg">
        {org.logo && <AvatarImage src={org.logo || '/placeholder.svg'} alt={org.name} />}
        <AvatarFallback className="bg-primary text-primary-foreground rounded-lg text-xl font-semibold">
          {org.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">{org.name}</h1>
          <Badge variant="secondary" className="font-mono text-xs">
            {org.slug}
          </Badge>
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {org.members.length} {org.members.length === 1 ? 'member' : 'members'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            {ownerCount} {ownerCount === 1 ? 'owner' : 'owners'}, {adminCount}{' '}
            {adminCount === 1 ? 'admin' : 'admins'}, {memberCount}{' '}
            {memberCount === 1 ? 'member' : 'members'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Created {formatDate(org.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
