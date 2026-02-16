import { auth } from '@/auth';
import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import { headers } from 'next/headers';

import Page2 from './page2';

export default async function Page() {
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return (
    <>
      <Header>
        <CustomBreadcrumbs current="Organizations" />
      </Header>
      <Page2 organizations={organizations} />
    </>
  );
}
