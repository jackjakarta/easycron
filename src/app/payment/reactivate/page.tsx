import { getUser } from '@/auth/utils';
import { stripeCreateCheckoutSessionWithResult } from '@/stripe/checkout-session';
import { MONTHLY_PRICE_ID, YEARLY_PRICE_ID } from '@/stripe/const';
import { subscriptionTypeSchema } from '@/stripe/schemas';
import { getBaseUrlFromHeaders } from '@/utils/host';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

const pageContextSchema = z.object({
  searchParams: z.object({
    type: subscriptionTypeSchema.default('monthly'),
  }),
});

export default async function Page(context: unknown) {
  const pageContext = pageContextSchema.safeParse(context);

  if (!pageContext.success) {
    return notFound();
  }

  const user = await getUser();

  const { type } = pageContext.data.searchParams;
  const customerId = user.id;

  if (customerId === null) {
    notFound();
  }

  const baseUrl = await getBaseUrlFromHeaders();

  const [createSessionError, session] = await stripeCreateCheckoutSessionWithResult({
    customerId,
    priceId: type === 'monthly' ? MONTHLY_PRICE_ID : YEARLY_PRICE_ID,
    redirectUrl: baseUrl,
    hasFreeTrial: true,
  });

  if (createSessionError !== null || session.url === null) {
    return notFound();
  }

  redirect(session.url);
}
