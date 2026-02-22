'use client';

import { authClient } from '@/auth/client';
import { Button } from '@/components/ui/button';

type BuySubscriptionButtonProps = {
  plan?: 'pro';
  annual?: boolean;
  organizationId: string;
};

export default function BuySubscriptionButton({
  plan = 'pro',
  annual = false,
  organizationId,
}: BuySubscriptionButtonProps) {
  async function handleSubscribe() {
    const { error } = await authClient.subscription.upgrade({
      plan,
      successUrl: '/dashboard',
      cancelUrl: '/pricing',
      annual,
      referenceId: organizationId,
      seats: 1,
    });

    if (error !== null) {
      console.error('Error creating subscription:', error);
      return;
    }
  }

  return (
    <Button onClick={handleSubscribe}>{plan === 'pro' ? 'Buy Pro Plan' : 'Buy Basic Plan'}</Button>
  );
}
