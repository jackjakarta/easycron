'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecentJobExecutionsQuery } from '@/hooks/query/use-recent-executions';
import { format, formatDistanceToNow } from 'date-fns';
import { Activity, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type ExecutionStatus = 'succeeded' | 'failed' | 'timed_out' | 'skipped';

export function RecentExecutions() {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');

  const { data: executions = [], isLoading, isError } = useRecentJobExecutionsQuery();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t('recent-executions')}
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/executions">
            {tCommon('view-all')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="text-muted-foreground mb-4 h-12 w-12 animate-spin" />
              <h3 className="text-lg font-semibold">Loading executions...</h3>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="text-lg font-semibold">Failed to load executions</h3>
              <p className="text-muted-foreground text-sm">
                There was an error fetching the recent executions. Please try again later.
              </p>
            </div>
          )}

          {!isLoading && !isError && executions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="text-lg font-semibold">No executions yet</h3>
              <p className="text-muted-foreground text-sm">
                Executions will appear here once jobs start running.
              </p>
            </div>
          )}

          {!isLoading &&
            executions.length > 0 &&
            executions.map((execution) => (
              <div
                key={execution.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex flex-1 items-center gap-4">
                  <Badge
                    variant={execution.status === 'succeeded' ? 'default' : 'secondary'}
                    className={statusToClassName(execution.status)}
                  >
                    {execution.status}
                  </Badge>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{'job one'}</p>
                      <span className="text-muted-foreground text-xs">·</span>
                      {/* <p className="text-muted-foreground text-sm">{execution.projectName}</p> */}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {formatDistanceToNow(execution.startedAt, { addSuffix: true })} ·{' '}
                      {format(execution.startedAt, 'MMM d, HH:mm:ss')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  {execution.httpStatus !== null && (
                    <Badge
                      variant="outline"
                      className={httpStatusToClassName(execution.httpStatus)}
                    >
                      {execution.httpStatus}
                    </Badge>
                  )}
                  {execution.latencyMs !== null && (
                    <span className="text-muted-foreground">{execution.latencyMs} ms</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function statusToClassName(status: ExecutionStatus): string {
  const statusColors: Record<ExecutionStatus, string> = {
    succeeded: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    timed_out: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    skipped: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  };

  return statusColors[status];
}

function httpStatusToClassName(statusCode: number): string {
  console.log('HTTP Status Code:', statusCode); // Debug log
  if (statusCode >= 200 && statusCode < 300) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  } else if (statusCode >= 300 && statusCode < 400) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  } else if (statusCode >= 400 && statusCode < 500) {
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
  } else if (statusCode >= 500) {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
}
