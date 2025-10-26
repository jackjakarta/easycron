import { getUser } from '@/auth/utils';
import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import PageContainer from '@/components/layout/page-container';
import { TypographyH3 } from '@/components/ui/typography';
import { dbGetJobsExecutionsSuccessRate } from '@/db/functions/execution';
import { dbGetEnabledJobCountByUserId, dbGetJobCountByUserId } from '@/db/functions/job';
import { getTimeBasedGreeting } from '@/utils/greeting';
import React from 'react';

import DashboardStats from './dashboard-stats';
import RecentExecutions from './recent-executions';

export default async function Page() {
  const user = await getUser();

  const [jobsCount, enabledJobsCount, stats] = await Promise.all([
    dbGetJobCountByUserId({ userId: user.id }),
    dbGetEnabledJobCountByUserId({ userId: user.id }),
    dbGetJobsExecutionsSuccessRate({ userId: user.id }),
  ]);

  const [firstName] = user.name.split(' ');
  const { successRate, avgLatencyMs } = stats;

  return (
    <>
      <Header>
        <CustomBreadcrumbs current="Dashboard" />
      </Header>
      <PageContainer wide>
        <TypographyH3>{getTimeBasedGreeting(firstName?.trim())}</TypographyH3>
        <DashboardStats
          totalJobs={jobsCount}
          activeJobs={enabledJobsCount}
          avgLatencyMs={Math.round(avgLatencyMs)}
          successRate={successRate}
        />
        <div className="grid gap-4">
          <RecentExecutions />
        </div>
      </PageContainer>
    </>
  );
}
