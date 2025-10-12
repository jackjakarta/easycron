'use client';

import { authClient } from '@/auth/client';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { TypographyH1, TypographyH3, TypographyP } from '@/components/ui/typography';
import { cn } from '@/utils/tailwind';
import React from 'react';

import { PricingCard } from './pricing-card';

export default function Page2() {
  const { data: session } = authClient.useSession();
  const [isAnnual, setIsAnnual] = React.useState(true);

  return (
    <PageContainer>
      <div className="mt-8 mb-16 space-y-4 text-center">
        <div className="mb-6 flex justify-center">
          <Badge
            variant="secondary"
            className="bg-accent/20 text-accent-foreground border-accent/30 px-3 py-1"
          >
            New
          </Badge>
        </div>
        <TypographyH1 className="text-5xl">Plans and Pricing</TypographyH1>
        <TypographyH3>
          Get started immediately for free. Upgrade for more credits, usage and collaboration.
        </TypographyH3>

        {/* Billing Toggle */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <TypographyP
            className={cn('text-sm', isAnnual ? 'text-muted-foreground' : 'text-foreground')}
          >
            Monthly
          </TypographyP>
          <Switch
            aria-label="Toggle annual billing"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <TypographyP
            className={cn('text-sm', isAnnual ? 'text-foreground' : 'text-muted-foreground')}
          >
            Annual
          </TypographyP>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2">
        <PricingCard
          name="Free"
          price="€0"
          plan="free"
          period={isAnnual ? '/year' : '/month'}
          description="For people looking to explore."
          features={['1 Project', '5 jobs per project', '500 job runs per month']}
          buttonText="Start Building"
          buttonVariant="secondary"
          annual={isAnnual}
          isLoggedIn={session !== null}
        />

        <PricingCard
          name="Pro"
          price={isAnnual ? '€150' : '€15'}
          period={isAnnual ? '/year' : '/month'}
          description="For higher limits and power users."
          features={[
            'Unlimited projects',
            'Unlimited jobs per project',
            'Unlimited job runs per month',
          ]}
          buttonText={session !== null ? 'Upgrade to Pro' : 'Buy Pro Plan'}
          buttonVariant="default"
          plan="pro"
          highlighted
          annual={isAnnual}
          isLoggedIn={session !== null}
        />
      </div>
    </PageContainer>
  );
}
