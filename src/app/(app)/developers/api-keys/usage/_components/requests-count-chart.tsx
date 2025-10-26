'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useApiKeysQuery } from '@/hooks/query/use-api-keys-query';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function RequestsCountChart() {
  const { data: apiKeys = [] } = useApiKeysQuery({
    refetchInterval: 120000, // refetch every 2 minutes
  });

  const topApiKeysByRequestCount = apiKeys
    .filter((key) => key.requestCount > 0)
    .map((key) => ({
      name: key.name,
      requests: key.requestCount,
      remaining: key.rateLimitMax,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top API Keys by Requests</CardTitle>
        <CardDescription>Total requests per API key</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            requests: {
              label: 'Requests',
              color: 'var(--chart-2)',
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topApiKeysByRequestCount} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" className="text-xs" />
              <YAxis dataKey="name" type="category" width={100} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="requests" fill="var(--color-requests)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
