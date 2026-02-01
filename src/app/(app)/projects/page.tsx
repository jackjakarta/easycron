import { getUser } from '@/auth/utils';
import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import PageContainer from '@/components/layout/page-container';

import ProjectsDisplay from './projects-display';

export default async function Page() {
  const user = await getUser();

  return (
    <>
      <Header>
        <CustomBreadcrumbs current="Projects" />
      </Header>
      <PageContainer wide>
        <ProjectsDisplay userId={user.id} />
      </PageContainer>
    </>
  );
}
