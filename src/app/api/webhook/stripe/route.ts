import { dbUpdateCustomerSubscriptions } from '@/db/functions/customer';
import { dbGetUserEmailByCustomerId } from '@/db/functions/user';
import { sendUserActionInformationEmail } from '@/email/send';
import { env } from '@/env';
import { getStripeSubscriptionsByCustomerId } from '@/stripe/subscription';
import {
  getMaybeCustomerIdFromStripeEvent,
  stripeWebhooksConstructEvent,
  stripeWebhooksConstructEventWithResult,
} from '@/stripe/webhook';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');

  if (signature === null) {
    console.warn(
      'payment',
      "Got a request at webhook endpoint that doesn't contain a stripe-signature header.",
      undefined,
    );

    return Response.json('Signature check failed.', { status: 400 });
  }

  const body = await req.text();

  try {
    const event = await stripeWebhooksConstructEvent({
      eventText: body,
      signature,
      stripeWebhookSecret: env.stripeWebhookSecret,
    });

    const customerId = getMaybeCustomerIdFromStripeEvent({ event });

    if (customerId === undefined) {
      return Response.json({ error: 'Failed to get customer id from event' }, { status: 400 });
    }

    const subscriptions = await getStripeSubscriptionsByCustomerId({
      customerId,
    });

    await dbUpdateCustomerSubscriptions({ customerId, subscriptions });

    if (event?.type === 'invoice.paid') {
      const userEmailObject = await dbGetUserEmailByCustomerId({ customerId });

      if (userEmailObject !== undefined) {
        await sendUserActionInformationEmail({
          to: userEmailObject.email,
          information: { type: 'invoice-paid' },
        });
      }
    }

    return Response.json({ message: 'Ok' }, { status: 200 });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
