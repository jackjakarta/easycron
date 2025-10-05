'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle2, Clock } from 'lucide-react';

type DashboardStatsProps = {
  totalJobs: number;
  activeJobs: number;
  totalExecutions: number;
  successRate: number;
  failedExecutions: number;
  avgLatencyMs: number;
};

export function DashboardStats({
  totalJobs,
  activeJobs,
  totalExecutions,
  successRate,
  failedExecutions,
  avgLatencyMs,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          <Activity className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalJobs}</div>
          <p className="text-muted-foreground text-xs">
            <span className="text-green-600 dark:text-green-400">{activeJobs} active</span> ·{' '}
            {totalJobs - activeJobs} paused
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CheckCircle2 className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
          <p className="text-muted-foreground text-xs">
            {totalExecutions - failedExecutions} succeeded ·{' '}
            <span className="text-red-600 dark:text-red-400">{failedExecutions} failed</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
          <Clock className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgLatencyMs}ms</div>
          <p className="text-muted-foreground text-xs">Across {totalExecutions} executions</p>
        </CardContent>
      </Card>
    </div>
  );
}
