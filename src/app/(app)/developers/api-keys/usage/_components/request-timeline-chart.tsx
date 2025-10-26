'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const requestTimelineData = [
  { date: 'Jan 20', requests: 1200 },
  { date: 'Jan 21', requests: 1850 },
  { date: 'Jan 22', requests: 2100 },
  { date: 'Jan 23', requests: 1650 },
  { date: 'Jan 24', requests: 2400 },
  { date: 'Jan 25', requests: 2800 },
  { date: 'Jan 26', requests: 3200 },
  { date: 'Jan 27', requests: 2400 },
  { date: 'Jan 28', requests: 3200 },
];

export default function RequestTimelineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Timeline</CardTitle>
        <CardDescription>Daily API requests over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            requests: {
              label: 'Requests',
              color: 'var(--chart-1)',
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={requestTimelineData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ fill: 'var(--chart-1)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
