import { auth } from '@/auth';
import { getAsyncPageContext, type PageContext } from '@/utils/context';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { z } from 'zod';

const pageContextSchema = z.object({
  params: z.object({
    organizationSlug: z.string(),
  }),
});

export default async function Page(context: PageContext) {
  const pageContext = pageContextSchema.safeParse(await getAsyncPageContext(context));

  if (!pageContext.success) {
    return notFound();
  }

  const { organizationSlug } = pageContext.data.params;

  const organization = await auth.api.getFullOrganization({
    query: { organizationSlug },
    headers: await headers(),
  });

  if (organization === null) {
    return notFound();
  }

  return (
    <div>
      <h1>Organization Page</h1>
      <div>
        <h2>{organization.name}</h2>
        <p>Slug: {organization.slug}</p>
        <h3>Members:</h3>
        <ul>
          {organization.members.map((member) => (
            <li key={member.id}>
              {member.user.email} - Role: {member.role}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
