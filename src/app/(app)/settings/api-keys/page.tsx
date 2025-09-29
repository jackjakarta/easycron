import { getUser } from '@/auth/utils';
import Header from '@/components/common/header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { dbGetUserApiKeys } from '@/db/functions/api-key';

import ApiKeysTable from './api-keys-table';

export default async function Page() {
  const user = await getUser();
  const apiKeys = await dbGetUserApiKeys({ userId: user.id });

  return (
    <>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ApiKeysTable />
      </div>
    </>
  );
}
