import { auth } from '@/auth';
import { getUser } from '@/auth/utils';
import { getBaseUrlFromHeaders } from '@/utils/host';
import { getLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

export default async function Page() {
  const [user, locale, baseUrl, _headers] = await Promise.all([
    getUser(),
    getLocale(),
    getBaseUrlFromHeaders(),
    headers(),
  ]);

  if (user.subscription.type === 'free') {
    redirect('/pricing');
  }

  const { url } = await auth.api.createBillingPortal({
    body: {
      locale: locale as Stripe.Checkout.Session.Locale,
      returnUrl: `${baseUrl}/dashboard`,
    },
    headers: _headers,
  });

  redirect(url);
}
