import { getUser } from '@/auth/utils';
import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import PageContainer from '@/components/layout/page-container';
import { dbGetProjects } from '@/db/functions/project';
import { dbGetOrganizationWebhookEndpoints } from '@/db/functions/webhook';

import HeaderSection from './header-section';
import WebhookEndpointsTable from './webhook-endpoints-table';
import WebhookStats from './webhook-stats';

export default async function Page() {
  const user = await getUser();

  const { organizationId } = user;

  const [projects, endpoints] = await Promise.all([
    dbGetProjects({ organizationId }),
    dbGetOrganizationWebhookEndpoints({ organizationId }),
  ]);

  return (
    <>
      <Header>
        <CustomBreadcrumbs
          current="Webhooks"
          trail={[{ name: 'Developers', href: '/developers' }]}
        />
      </Header>
      <PageContainer wide>
        <HeaderSection projects={projects} />
        <WebhookStats endpoints={endpoints} />
        <WebhookEndpointsTable endpoints={endpoints} />
      </PageContainer>
    </>
  );
}
