'use client';

import { authClient } from '@/auth/client';
import { Button } from '@/components/ui/button';

type BuySubscriptionButtonProps = {
  plan?: 'pro';
  annual?: boolean;
};

export default function BuySubscriptionButton({
  plan = 'pro',
  annual = false,
}: BuySubscriptionButtonProps) {
  async function handleSubscribe() {
    const { error } = await authClient.subscription.upgrade({
      plan,
      successUrl: '/dashboard',
      cancelUrl: '/pricing',
      annual,
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
