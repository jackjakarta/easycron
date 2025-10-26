import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import PageContainer from '@/components/layout/page-container';
import { TypographyH3, TypographyP } from '@/components/ui/typography';

import KeyStatusDistributionChart from './_components/key-status-distribution-chart';
import RateLimitChart from './_components/rate-limit-chart';
import RequestTimelineChart from './_components/request-timeline-chart';
import RequestsCountChart from './_components/requests-count-chart';
import TopStats from './_components/top-stats';

export default function Page() {
  return (
    <>
      <Header>
        <CustomBreadcrumbs
          current="Usage"
          trail={[
            { name: 'Developers', href: '/developers' },
            { name: 'API Keys', href: '/developers/api-keys' },
          ]}
        />
      </Header>
      <PageContainer wide>
        <div>
          <TypographyH3>API Key Analytics</TypographyH3>
          <TypographyP className="text-muted-foreground mt-2">
            Monitor and analyze your API key usage, rate limits, and performance metrics
          </TypographyP>
        </div>
        <TopStats />
        <div className="grid gap-6 md:grid-cols-2">
          <RequestTimelineChart />
          <KeyStatusDistributionChart />
          <RequestsCountChart />
          <RateLimitChart />
        </div>
      </PageContainer>
    </>
  );
}
