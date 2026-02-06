import { auth } from '@/auth';
import { headers } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const member = await auth.api.getActiveMember({
    headers: await headers(),
  });

  if (member === null) {
    redirect('/dashboard', RedirectType.replace);
  }

  return <>{children}</>;
}
