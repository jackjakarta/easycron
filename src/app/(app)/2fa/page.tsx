import { getUser } from '@/auth/utils';
import { dbGetAccountByUserIdAndProvider } from '@/db/functions/account';

import Disable2FAButton from './disable-2fa-button';
import Enable2FAButton from './enable-2fa-button';

export default async function Page() {
  const user = await getUser();

  const account = await dbGetAccountByUserIdAndProvider({
    userId: user.id,
    provider: 'credential',
  });

  if (account === undefined || account.password === null) {
    return <span>Password not set. Cannot enable 2FA.</span>;
  }

  if (user.twoFactorEnabled) {
    return <Disable2FAButton />;
  }

  return <Enable2FAButton />;
}
