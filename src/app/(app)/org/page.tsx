import { auth } from '@/auth';
import { headers } from 'next/headers';

import CreateOrganizationDialog from './create-organization-dialog';

export default async function Page() {
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return (
    <div>
      <h1>Organization Page</h1>
      <CreateOrganizationDialog />
      {organizations.length === 0 ? (
        <p>No organizations found.</p>
      ) : (
        <ul>
          {organizations.map((org) => (
            <li key={org.id}>
              {org.name} (Slug: {org.slug})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
