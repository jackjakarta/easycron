import { getUser } from '@/auth/utils';
import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import PageContainer from '@/components/layout/page-container';
import { TypographyH3, TypographyP } from '@/components/ui/typography';
import { dbGetTotalRequestsCountByUserId, dbGetUserApiKeys } from '@/db/functions/api-key';

import KeyStatusDistributionChart from './_components/key-status-distribution-chart';
import RateLimitChart from './_components/rate-limit-chart';
import RequestTimelineChart from './_components/request-timeline-chart';
import RequestsCountChart from './_components/requests-count-chart';
import TopStats from './_components/top-stats';

export default async function Page() {
  const user = await getUser();

  const [totalRequests, apiKeys] = await Promise.all([
    dbGetTotalRequestsCountByUserId({ userId: user.id }),
    dbGetUserApiKeys({ userId: user.id }),
  ]);

  const noOfApiKeys = apiKeys.length;
  const noOfEnabledApiKeys = apiKeys.filter((key) => key.enabled).length;

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
        <TopStats
          totalRequests={totalRequests}
          activeKeys={noOfEnabledApiKeys}
          totalKeys={noOfApiKeys}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <RequestTimelineChart />
          <KeyStatusDistributionChart />
          <RequestsCountChart initialApiKeys={apiKeys} />
          <RateLimitChart />
        </div>
      </PageContainer>
    </>
  );
}
