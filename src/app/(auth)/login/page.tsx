import { getMaybeSession } from '@/auth/utils';
import { redirect, RedirectType } from 'next/navigation';

import LoginForm from './login-form';

export default async function Page() {
  const session = await getMaybeSession();

  if (session !== null) {
    redirect('/', RedirectType.replace);
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-gray-500">Sign in to your account</p>
        <LoginForm />
      </div>
    </div>
  );
}
