import { getUser } from '@/auth/utils';
import { getAsyncPageContext, type PageContext } from '@/utils/context';
import { notFound } from 'next/navigation';
import { z } from 'zod';

const pageContextSchema = z.object({
  params: z.object({
    organizationSlug: z.string(),
  }),
  searchParams: z.object({
    inviteId: z.uuid(),
  }),
});

export default async function Page(context: PageContext) {
  const user = await getUser();
  const pageContext = pageContextSchema.safeParse(await getAsyncPageContext(context));

  if (!pageContext.success) {
    return notFound();
  }

  const { organizationSlug } = pageContext.data.params;
  const { inviteId } = pageContext.data.searchParams;

  return (
    <div>
      <h1>Accept Invitation</h1>
      <p>Organization Slug: {organizationSlug}</p>
      <p>Invite ID: {inviteId}</p>
      <p>User: {user.email}</p>
      {/* Add your invitation acceptance logic here */}
    </div>
  );
}
