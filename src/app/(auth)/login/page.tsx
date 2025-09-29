import { getMaybeSession } from '@/auth/utils';
import { redirect, RedirectType } from 'next/navigation';

import LoginForm from './login-form';

export default async function Page() {
  const session = await getMaybeSession();

  if (session !== null) {
    redirect('/', RedirectType.replace);
  }

  return <LoginForm />;
}
