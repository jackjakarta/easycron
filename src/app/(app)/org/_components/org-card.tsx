'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight, Settings } from 'lucide-react';
import Link from 'next/link';

export type Organization = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string | null | undefined;
  metadata?: Record<string, unknown>;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Deterministic color from org name
const orgColors = [
  'bg-emerald-600',
  'bg-sky-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-indigo-600',
  'bg-teal-600',
];

function getOrgColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return orgColors[Math.abs(hash) % orgColors.length];
}

export function OrganizationCard({ org }: { org: Organization }) {
  const memberCount = (org.metadata as Record<string, unknown>)?.members ?? 1;
  const plan = ((org.metadata as Record<string, unknown>)?.plan as string) ?? 'Free';

  return (
    <button
      type="button"
      className="group border-border bg-card hover:border-primary/40 hover:bg-secondary/60 focus-visible:ring-ring relative flex w-full cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-all focus-visible:ring-2 focus-visible:outline-none"
    >
      <Avatar className="h-11 w-11 rounded-lg">
        {org.logo ? <AvatarImage src={org.logo} alt={org.name} /> : null}
        <AvatarFallback
          className={`text-foreground rounded-lg text-sm font-semibold ${getOrgColor(org.name)}`}
        >
          {getInitials(org.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-foreground truncate text-sm font-medium">{org.name}</span>
        <span className="text-muted-foreground truncate text-xs">
          {String(memberCount)} member{Number(memberCount) !== 1 ? 's' : ''}
          {' \u00B7 '}
          {plan} plan
          {' \u00B7 '}
          Created {formatDistanceToNow(org.createdAt, { addSuffix: true })}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <span
              role="button"
              tabIndex={0}
              className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Organization settings"
            >
              <Settings className="h-4 w-4" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/org/${org.slug}`}>General settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Members</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Leave organization
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ChevronRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}
