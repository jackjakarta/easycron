import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import PageContainer from '@/components/layout/page-container';

import ApiKeysTable from './api-keys-table';

export default async function Page() {
  return (
    <>
      <Header>
        <CustomBreadcrumbs
          current="API Keys"
          trail={[{ name: 'Developers', href: '/developers' }]}
        />
      </Header>
      <PageContainer wide>
        <ApiKeysTable />
      </PageContainer>
    </>
  );
}
