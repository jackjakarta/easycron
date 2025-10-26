'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const apiKeyStatusData = [
  { name: 'Enabled', value: 12, fill: 'var(--chart-1)' },
  { name: 'Disabled', value: 3, fill: 'var(--chart-2)' },
  { name: 'Expired', value: 2, fill: 'var(--chart-3)' },
];

export default function KeyStatusDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key Status</CardTitle>
        <CardDescription>Distribution of key states</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            enabled: {
              label: 'Enabled',
              color: 'var(--chart-1)',
            },
            disabled: {
              label: 'Disabled',
              color: 'var(--chart-2)',
            },
            expired: {
              label: 'Expired',
              color: 'var(--chart-3)',
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={apiKeyStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {apiKeyStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
