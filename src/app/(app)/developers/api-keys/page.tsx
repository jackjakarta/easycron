import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';

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
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ApiKeysTable />
      </div>
    </>
  );
}
