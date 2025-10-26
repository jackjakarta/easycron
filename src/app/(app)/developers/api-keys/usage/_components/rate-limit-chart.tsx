import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const rateLimitData = [
  { name: 'prod-api-key', used: 76, limit: 100 },
  { name: 'dev-api-key', used: 42, limit: 100 },
  { name: 'staging-key', used: 89, limit: 100 },
  { name: 'test-key', used: 23, limit: 100 },
  { name: 'mobile-app', used: 67, limit: 100 },
];

export default function RateLimitChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Limit Usage</CardTitle>
        <CardDescription>Current usage vs. limit per API key</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            used: {
              label: 'Used',
              color: 'var(--chart-4)',
            },
            remaining: {
              label: 'Remaining',
              color: 'var(--chart-5)',
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rateLimitData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={80} />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="used" fill="var(--color-used)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
