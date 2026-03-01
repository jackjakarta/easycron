import { auth } from '@/auth';
import { getValidSession } from '@/auth/utils';
import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import PageContainer from '@/components/layout/page-container';
import { getAsyncPageContext, type PageContext } from '@/utils/context';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import OrganizationOverview from './_components/org-overview';

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

  const [session, organization] = await Promise.all([
    getValidSession(),
    auth.api.getFullOrganization({
      query: { organizationSlug },
      headers: await headers(),
    }),
  ]);

  if (organization === null) {
    return notFound();
  }

  return (
    <>
      <Header>
        <CustomBreadcrumbs
          current={organization.name}
          trail={[{ name: 'Organizations', href: '/org' }]}
        />
      </Header>
      <PageContainer>
        <OrganizationOverview org={organization} currentUserId={session.user.id} />
      </PageContainer>
    </>
  );
}
