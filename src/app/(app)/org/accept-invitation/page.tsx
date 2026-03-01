import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import PageContainer from '@/components/layout/page-container';
import { db } from '@/db';
import { invitationTable, organizationTable } from '@/db/schema';
import { getAsyncPageContext, type PageContext } from '@/utils/context';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import AcceptInvitationCard from './_components/accept-invitation-card';

const searchParamsSchema = z.object({
  searchParams: z.object({
    inviteId: z.string().uuid(),
    slug: z.string(),
  }),
});

export default async function Page(context: PageContext) {
  const parsed = searchParamsSchema.safeParse(await getAsyncPageContext(context));

  if (!parsed.success) {
    return notFound();
  }

  const { inviteId, slug } = parsed.data.searchParams;

  const [invitation] = await db
    .select({
      id: invitationTable.id,
      email: invitationTable.email,
      role: invitationTable.role,
      status: invitationTable.status,
      expiresAt: invitationTable.expiresAt,
      organizationId: invitationTable.organizationId,
    })
    .from(invitationTable)
    .where(eq(invitationTable.id, inviteId));

  if (!invitation) {
    return notFound();
  }

  const [organization] = await db
    .select({
      id: organizationTable.id,
      name: organizationTable.name,
      slug: organizationTable.slug,
      logo: organizationTable.logo,
    })
    .from(organizationTable)
    .where(eq(organizationTable.id, invitation.organizationId));

  if (!organization || organization.slug !== slug) {
    return notFound();
  }

  return (
    <>
      <Header>
        <CustomBreadcrumbs
          current="Accept Invitation"
          trail={[{ name: 'Organizations', href: '/org' }]}
        />
      </Header>
      <PageContainer>
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <AcceptInvitationCard
            invitationId={invitation.id}
            organizationName={organization.name}
            organizationSlug={organization.slug}
            organizationLogo={organization.logo}
            role={invitation.role}
            status={invitation.status}
            expiresAt={invitation.expiresAt.toISOString()}
          />
        </div>
      </PageContainer>
    </>
  );
}
