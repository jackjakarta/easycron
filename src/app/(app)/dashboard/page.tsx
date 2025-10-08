import { getUser } from '@/auth/utils';
import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import { getTimeBasedGreeting } from '@/utils/greeting';
import React from 'react';

import { DashboardStats } from './dashboard-stats';
import { JobsOverview } from './jobs-overview';
import { RecentExecutions } from './recent-executions';

const dashboardData = {
  stats: {
    totalJobs: 24,
    activeJobs: 18,
    totalExecutions: 1247,
    successRate: 94.3,
    failedExecutions: 71,
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
  const [firstName] = user.name.split(' ');

  return (
    <>
      <Header>
        <CustomBreadcrumbs current="Dashboard" />
      </Header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-xl font-medium selection:bg-red-500">
          {getTimeBasedGreeting(firstName?.trim())}
        </h1>
        <DashboardStats {...dashboardData.stats} />
        <div className="grid gap-4 md:grid-cols-2">
          <RecentExecutions />
          <JobsOverview jobs={dashboardData.jobs} />
        </div>
      </div>
    </>
  );
}
