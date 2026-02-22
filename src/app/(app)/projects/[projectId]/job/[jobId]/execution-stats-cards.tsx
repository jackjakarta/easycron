'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ExecutionHourlyStats } from '@/db/functions/execution-analytics';

type ExecutionStatsCardsProps = {
  data: ExecutionHourlyStats[];
};

export default function ExecutionStatsCards({ data }: ExecutionStatsCardsProps) {
  const totals = data.reduce(
    (acc, row) => {
      acc.total += row.totalCount;
      acc.succeeded += row.succeededCount;
      acc.failed += row.failedCount;
      acc.timedOut += row.timedOutCount;
      acc.skipped += row.skippedCount;
      return acc;
    },
    { total: 0, succeeded: 0, failed: 0, timedOut: 0, skipped: 0 },
  );

  const successRate = totals.total > 0 ? (totals.succeeded / totals.total) * 100 : 0;

  const latencyRows = data.filter((r) => r.avgLatencyMs !== null);
  const avgLatency =
    latencyRows.length > 0
      ? latencyRows.reduce((sum, r) => sum + (r.avgLatencyMs ?? 0), 0) / latencyRows.length
      : 0;

  const p95Latency =
    latencyRows.length > 0 ? Math.max(...latencyRows.map((r) => r.p95LatencyMs ?? 0)) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Total Executions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totals.total.toLocaleString()}</div>
          <p className="text-muted-foreground text-xs">
            {totals.failed + totals.timedOut} failed or timed out
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
          <p className="text-muted-foreground text-xs">
            {totals.succeeded.toLocaleString()} succeeded
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">Avg Latency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgLatency.toFixed(0)} ms</div>
          <p className="text-muted-foreground text-xs">Across all hourly buckets</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">P95 Latency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{p95Latency.toFixed(0)} ms</div>
          <p className="text-muted-foreground text-xs">Worst-case hourly P95</p>
        </CardContent>
      </Card>
    </div>
  );
}
