'use client';

import PageContainer from '@/components/layout/page-container';
import { Input } from '@/components/ui/input';
import { type Organization } from 'better-auth/plugins';
import { Search } from 'lucide-react';
import React from 'react';

import { OrganizationCard } from './_components/org-card';

type Page2Props = {
  organizations: Organization[];
};

export default function Page2({ organizations }: Page2Props) {
  const [search, setSearch] = React.useState('');

  const filtered = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageContainer>
      <div className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight text-balance">
          Your organizations
        </h1>
        <p className="text-muted-foreground text-sm">
          Select an organization to continue, or create a new one.
        </p>
      </div>

      <div className="relative mt-6">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search organizations..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {filtered.length > 0 ? (
          filtered.map((org) => <OrganizationCard key={org.id} org={org} />)
        ) : (
          <div className="border-border flex flex-col items-center gap-2 rounded-xl border border-dashed py-12 text-center">
            <p className="text-foreground text-sm font-medium">No organizations found</p>
            <p className="text-muted-foreground text-xs">
              Try a different search term or create a new organization.
            </p>
          </div>
        )}
      </div>

      <p className="text-muted-foreground mt-6 text-center text-xs">
        {organizations.length} organization{organizations.length !== 1 ? 's' : ''} total
      </p>
    </PageContainer>
  );
}
