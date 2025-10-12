import { auth } from '@/auth';
import { getUser } from '@/auth/utils';
import { getBaseUrlFromHeaders } from '@/utils/host';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getUser();
  const { subscription } = user;

  if (subscription.type === 'free') {
    redirect('/pricing');
  }

  const baseUrl = await getBaseUrlFromHeaders();

  const { url } = await auth.api.createBillingPortal({
    body: {
      locale: 'en',
      returnUrl: `${baseUrl}/dashboard`,
    },
    headers: await headers(),
  });

  redirect(url);
}
