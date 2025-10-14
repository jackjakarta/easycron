import { getUser } from '@/auth/utils';
import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import PageContainer from '@/components/layout/page-container';
import { dbGetAccountByUserIdAndProvider } from '@/db/functions/account';

import AccountSettingsSections from './sections';

export default async function Page() {
  const user = await getUser();

  const account = await dbGetAccountByUserIdAndProvider({
    userId: user.id,
    provider: 'credential',
  });

  const hasSocialAccount = account === undefined || account.password === null;

  return (
    <>
      <Header>
        <CustomBreadcrumbs current="Account" trail={[{ name: 'Settings', href: '/settings' }]} />
      </Header>
      <PageContainer>
        <AccountSettingsSections
          twoFaEnabled={user.twoFactorEnabled}
          hasSocialAccount={hasSocialAccount}
        />
      </PageContainer>
    </>
  );
}
