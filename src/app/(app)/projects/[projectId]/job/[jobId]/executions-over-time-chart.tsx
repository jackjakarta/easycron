'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { type ExecutionHourlyStats } from '@/db/functions/execution-analytics';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type ExecutionsOverTimeChartProps = {
  data: ExecutionHourlyStats[];
};

const chartConfig = {
  succeeded: { label: 'Succeeded', color: 'var(--chart-1)' },
  failed: { label: 'Failed', color: 'var(--chart-2)' },
  timedOut: { label: 'Timed Out', color: 'var(--chart-3)' },
  skipped: { label: 'Skipped', color: 'var(--chart-4)' },
};

function formatBucket(bucket: Date) {
  return bucket.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric' });
}

export default function ExecutionsOverTimeChart({ data }: ExecutionsOverTimeChartProps) {
  const chartData = [...data]
    .sort((a, b) => a.bucket.getTime() - b.bucket.getTime())
    .map((row) => ({
      bucket: formatBucket(row.bucket),
      succeeded: row.succeededCount,
      failed: row.failedCount,
      timedOut: row.timedOutCount,
      skipped: row.skippedCount,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Executions Over Time</CardTitle>
        <CardDescription>Hourly execution counts by status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="bucket" className="text-xs" tick={{ fontSize: 11 }} />
              <YAxis className="text-xs" allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="succeeded"
                stackId="a"
                fill="var(--color-succeeded)"
                radius={[0, 0, 0, 0]}
              />
              <Bar dataKey="failed" stackId="a" fill="var(--color-failed)" />
              <Bar dataKey="timedOut" stackId="a" fill="var(--color-timedOut)" />
              <Bar
                dataKey="skipped"
                stackId="a"
                fill="var(--color-skipped)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
