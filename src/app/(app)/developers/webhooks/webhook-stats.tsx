'use client';

import { TypographyP } from '@/components/ui/typography';
import { Activity, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

type WebhookStatsProps = {
  endpoints: Array<{
    isActive: boolean;
    consecutiveFailures: number;
  }>;
};

export default function WebhookStats({ endpoints }: WebhookStatsProps) {
  const activeCount = endpoints.filter((e) => e.isActive).length;
  const failedCount = endpoints.filter((e) => e.consecutiveFailures > 0).length;
  const totalCount = endpoints.length;

  const stats = [
    {
      label: 'Total Endpoints',
      value: totalCount,
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Active',
      value: activeCount,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      label: 'Failed',
      value: failedCount,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
    {
      label: 'Success Rate',
      value: `${totalCount > 0 ? Math.round(((totalCount - failedCount) / totalCount) * 100) : 0}%`,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-card border-border rounded-lg border p-6">
            <div className="flex items-start justify-between">
              <div>
                <TypographyP className="text-muted-foreground mb-1 text-sm">
                  {stat.label}
                </TypographyP>
                <TypographyP className="text-foreground text-3xl font-bold">
                  {stat.value}
                </TypographyP>
              </div>
              <div className={`${stat.bgColor} rounded-lg p-3`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
