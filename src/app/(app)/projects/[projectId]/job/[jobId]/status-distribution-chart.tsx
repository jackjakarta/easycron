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
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

type StatusDistributionChartProps = {
  data: ExecutionHourlyStats[];
};

const chartConfig = {
  succeeded: { label: 'Succeeded', color: 'var(--chart-1)' },
  failed: { label: 'Failed', color: 'var(--chart-2)' },
  timedOut: { label: 'Timed Out', color: 'var(--chart-3)' },
  skipped: { label: 'Skipped', color: 'var(--chart-4)' },
};

export default function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  const totals = data.reduce(
    (acc, row) => {
      acc.succeeded += row.succeededCount;
      acc.failed += row.failedCount;
      acc.timedOut += row.timedOutCount;
      acc.skipped += row.skippedCount;
      return acc;
    },
    { succeeded: 0, failed: 0, timedOut: 0, skipped: 0 },
  );

  const pieData = [
    { name: 'succeeded', value: totals.succeeded, fill: 'var(--chart-1)' },
    { name: 'failed', value: totals.failed, fill: 'var(--chart-2)' },
    { name: 'timedOut', value: totals.timedOut, fill: 'var(--chart-3)' },
    { name: 'skipped', value: totals.skipped, fill: 'var(--chart-4)' },
  ].filter((d) => d.value > 0);

  if (pieData.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Distribution</CardTitle>
        <CardDescription>Overall execution status breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${chartConfig[name as keyof typeof chartConfig]?.label ?? name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
