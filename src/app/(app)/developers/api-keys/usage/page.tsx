'use client';

import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

// Mock data based on your API key schema
const requestCountData = [
  { name: 'prod-api-key', requests: 15420, remaining: 4580 },
  { name: 'dev-api-key', requests: 8230, remaining: 11770 },
  { name: 'staging-key', requests: 5890, remaining: 14110 },
  { name: 'test-key', requests: 3450, remaining: 16550 },
  { name: 'mobile-app', requests: 12100, remaining: 7900 },
];

const requestTimelineData = [
  { date: 'Jan 20', requests: 1200 },
  { date: 'Jan 21', requests: 1850 },
  { date: 'Jan 22', requests: 2100 },
  { date: 'Jan 23', requests: 1650 },
  { date: 'Jan 24', requests: 2400 },
  { date: 'Jan 25', requests: 2800 },
  { date: 'Jan 26', requests: 3200 },
];

const apiKeyStatusData = [
  { name: 'Enabled', value: 12, fill: 'var(--chart-1)' },
  { name: 'Disabled', value: 3, fill: 'var(--chart-2)' },
  { name: 'Expired', value: 2, fill: 'var(--chart-3)' },
];

const rateLimitData = [
  { name: 'prod-api-key', used: 76, limit: 100 },
  { name: 'dev-api-key', used: 42, limit: 100 },
  { name: 'staging-key', used: 89, limit: 100 },
  { name: 'test-key', used: 23, limit: 100 },
  { name: 'mobile-app', used: 67, limit: 100 },
];

export default function Page() {
  return (
    <>
      <Header>
        <CustomBreadcrumbs
          current="Usage"
          trail={[
            { name: 'Developers', href: '/developers' },
            { name: 'API Keys', href: '/developers/api-keys' },
          ]}
        />
      </Header>
      <PageContainer>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Key Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and analyze your API key usage, rate limits, and performance metrics
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Requests</CardDescription>
              <CardTitle className="text-3xl">45,090</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">+12.5% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Keys</CardDescription>
              <CardTitle className="text-3xl">12</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">Out of 17 total keys</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Rate Limit Usage</CardDescription>
              <CardTitle className="text-3xl">59%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">Across all keys</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Keys Near Limit</CardDescription>
              <CardTitle className="text-3xl">2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive text-xs">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Request Timeline */}
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
                className="h-[300px]"
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
                      stroke="var(--color-requests)"
                      strokeWidth={2}
                      dot={{ fill: 'var(--color-requests)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* API Key Status Distribution */}
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
                className="h-[300px]"
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

          {/* Request Count by API Key */}
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
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={requestCountData} layout="vertical">
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

          {/* Rate Limit Usage */}
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
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rateLimitData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      className="text-xs"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="used" fill="var(--color-used)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
