import BuySubscriptionButton from '@/app/(auth)/_components/buy-subscription-button';
import { getUser } from '@/auth/utils';
import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import { TypographyH3 } from '@/components/ui/typography';
import { dbGetJobsExecutionsSuccessRate } from '@/db/functions/execution';
import { dbGetEnabledJobCountByUserId, dbGetJobCountByUserId } from '@/db/functions/job';
import { getTimeBasedGreeting } from '@/utils/greeting';
import React from 'react';

import { DashboardStats } from './dashboard-stats';
import { JobsOverview } from './jobs-overview';
import { RecentExecutions } from './recent-executions';

const dashboardData = {
  stats: {
    avgLatencyMs: 342,
  },
  jobs: [
    {
      id: '1',
      name: 'Daily Backup',
      projectName: 'Production API',
      status: 'active' as const,
      schedule: '0 2 * * *',
      nextRun: new Date(Date.now() + 1000 * 60 * 60 * 6),
      lastRun: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: '2',
      name: 'Send Notifications',
      projectName: 'User Service',
      status: 'active' as const,
      schedule: '*/15 * * * *',
      nextRun: new Date(Date.now() + 1000 * 60 * 8),
      lastRun: new Date(Date.now() - 1000 * 60 * 12),
    },
    {
      id: '3',
      name: 'Data Sync',
      projectName: 'Analytics',
      status: 'error' as const,
      schedule: '0 */4 * * *',
      nextRun: new Date(Date.now() + 1000 * 60 * 60 * 2),
      lastRun: new Date(Date.now() - 1000 * 60 * 18),
    },
    {
      id: '4',
      name: 'Cache Cleanup',
      projectName: 'Production API',
      status: 'active' as const,
      schedule: '0 3 * * *',
      nextRun: new Date(Date.now() + 1000 * 60 * 60 * 7),
      lastRun: new Date(Date.now() - 1000 * 60 * 25),
    },
    {
      id: '5',
      name: 'Report Generation',
      projectName: 'Analytics',
      status: 'paused' as const,
      schedule: '0 8 * * MON',
      nextRun: null,
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
  ],
};

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
        {user.subscription === undefined && (
          <div className="flex flex-1 items-center justify-end">
            <BuySubscriptionButton />
          </div>
        )}
      </Header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <TypographyH3>{getTimeBasedGreeting(firstName?.trim())}</TypographyH3>
        <DashboardStats
          {...{
            ...dashboardData.stats,
            totalJobs: jobsCount,
            activeJobs: enabledJobsCount,
            avgLatencyMs: Math.round(avgLatencyMs),
            successRate,
          }}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <RecentExecutions />
          <JobsOverview jobs={dashboardData.jobs} />
        </div>
      </div>
    </>
  );
}
