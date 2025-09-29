import { getUser } from '@/auth/utils';
import Header from '@/components/common/header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

import ApiKeysTable from './api-keys-table';

export default async function Page() {
  await getUser();

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
