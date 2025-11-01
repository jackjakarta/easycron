import { auth } from '@/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const member = await auth.api.getActiveMember({
    headers: await headers(),
  });

  // User is not a member of this organization
  if (member === null) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
