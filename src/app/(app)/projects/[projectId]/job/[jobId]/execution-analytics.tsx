'use client';

import { type ExecutionHourlyStats } from '@/db/functions/execution-analytics';
import { useExecutionAnalyticsQuery } from '@/hooks/query/use-execution-analytics';

import ExecutionStatsCards from './execution-stats-cards';
import ExecutionsOverTimeChart from './executions-over-time-chart';
import LatencyTrendChart from './latency-trend-chart';
import StatusDistributionChart from './status-distribution-chart';

type ExecutionAnalyticsProps = {
  jobId: string;
  initialData: ExecutionHourlyStats[];
};

export default function ExecutionAnalytics({ jobId, initialData }: ExecutionAnalyticsProps) {
  const { data = [] } = useExecutionAnalyticsQuery({
    jobId,
    initialData,
  });

  if (data.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <ExecutionStatsCards data={data} />
      <div className="grid gap-4 lg:grid-cols-2">
        <ExecutionsOverTimeChart data={data} />
        <LatencyTrendChart data={data} />
      </div>
      <StatusDistributionChart data={data} />
    </div>
  );
}
