'use client';

import { authClient } from '@/auth/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/utils/tailwind';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type PricingCardProps = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  highlighted?: boolean;
  plan?: 'pro' | 'basic' | 'free';
  annual?: boolean;
  isLoggedIn?: boolean;
  userId?: string;
};

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant = 'default',
  highlighted = false,
  plan = 'pro',
  annual = false,
  isLoggedIn = false,
  userId,
}: PricingCardProps) {
  const router = useRouter();

  async function handleSubscribe() {
    const { data: subscriptions } = await authClient.subscription.list({
      query: {
        referenceId: userId,
      },
    });

    const activeSubscription = subscriptions?.find(
      (sub) => sub.status === 'active' || sub.status === 'trialing',
    );

    if (activeSubscription !== undefined) {
      toast.error('You already have an active subscription.');
      return;
    }

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

  function handleNavigateToLogin() {
    router.push('/dashboard');
  }

  return (
    <Card
      className={cn(
        'bg-card border-border flex flex-col',
        highlighted && 'border-accent/50 shadow-accent/10 shadow-lg',
      )}
    >
      <CardHeader className="space-y-4">
        <CardTitle className="text-card-foreground flex items-center gap-1 text-2xl font-bold">
          {name}

          {annual && plan === 'pro' && (
            <Badge
              variant="secondary"
              className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            >
              Save 20%
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-card-foreground text-5xl font-bold">{price}</span>
          <span className="text-muted-foreground">{period}</span>
        </div>
        <CardDescription className="text-muted-foreground text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="text-card-foreground mt-0.5 h-5 w-5 shrink-0" />
              <span className="text-card-foreground text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          size="lg"
          variant={buttonVariant}
          className="w-full font-medium"
          onClick={plan === 'pro' && isLoggedIn ? handleSubscribe : handleNavigateToLogin}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
