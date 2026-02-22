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
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type LatencyTrendChartProps = {
  data: ExecutionHourlyStats[];
};

const chartConfig = {
  avg: { label: 'Avg Latency (ms)', color: 'var(--chart-1)' },
  p95: { label: 'P95 Latency (ms)', color: 'var(--chart-3)' },
};

function formatBucket(bucket: Date) {
  return bucket.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric' });
}

export default function LatencyTrendChart({ data }: LatencyTrendChartProps) {
  const chartData = [...data]
    .sort((a, b) => new Date(a.bucket).getTime() - new Date(b.bucket).getTime())
    .filter((row) => row.avgLatencyMs !== null)
    .map((row) => ({
      bucket: formatBucket(new Date(row.bucket)),
      avg: row.avgLatencyMs,
      p95: row.p95LatencyMs,
    }));

  if (chartData.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latency Trend</CardTitle>
        <CardDescription>Average and P95 latency over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="bucket" className="text-xs" tick={{ fontSize: 11 }} />
              <YAxis className="text-xs" unit=" ms" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="var(--color-avg)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="p95"
                stroke="var(--color-p95)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
