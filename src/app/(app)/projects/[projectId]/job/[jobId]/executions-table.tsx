'use client';

import ApiKeysTableRowSkeleton from '@/app/(app)/developers/api-keys/api-keys-table-row-skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type ExecutionModel } from '@/db/schema';
import { useJobExecutionsQuery } from '@/hooks/query/use-job-executions';
import { format, formatDistanceToNow } from 'date-fns';
import { Activity, Clock } from 'lucide-react';

type ExecutionsTableProps = {
  executions: ExecutionModel[];
  jobId: string;
  jobName: string;
};

export default function ExecutionsTable({ executions, jobName, jobId }: ExecutionsTableProps) {
  const { data: jobExecutions = [], isLoading } = useJobExecutionsQuery({
    jobId,
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Executions for {jobName} ({executions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Attempt</TableHead>
                <TableHead>Scheduled For</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>HTTP Status</TableHead>
                <TableHead>Latency</TableHead>
                <TableHead>Request Size</TableHead>
                <TableHead>Response Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 8 }).map((_, index) => (
                  <ApiKeysTableRowSkeleton key={`skeleton-${index}`} />
                ))}

              {!isLoading && jobExecutions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 py-8">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Activity className="text-muted-foreground mb-4 h-12 w-12" />
                      <h3 className="text-lg font-semibold">No executions yet</h3>
                      <p className="text-muted-foreground text-sm">
                        Executions will appear here once the job runs.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                jobExecutions.length > 0 &&
                jobExecutions.map((execution) => (
                  <TableRow key={execution.id}>
                    <TableCell>
                      <Badge
                        variant={execution.status === 'succeeded' ? 'default' : 'secondary'}
                        className={statusToClassName(execution.status)}
                      >
                        {execution.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">#{execution.attempt}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {formatDistanceToNow(execution.scheduledFor, { addSuffix: true })}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {format(execution.scheduledFor, 'MMM d, HH:mm:ss')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {format(execution.startedAt, 'MMM d, HH:mm:ss')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {execution.finishedAt ? (
                        <div className="flex items-center gap-1">
                          <Clock className="text-muted-foreground h-3 w-3" />
                          <span className="text-sm">
                            {formatDuration(execution.startedAt, execution.finishedAt)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Running...</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {execution.httpStatus !== null ? (
                        <Badge
                          variant="outline"
                          className={httpStatusToClassName(execution.httpStatus)}
                        >
                          {execution.httpStatus}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {execution.latencyMs !== null ? (
                        <span className="text-sm">{execution.latencyMs}ms</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {execution.requestSize !== null ? (
                        <span className="text-sm">{formatBytes(execution.requestSize)}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {execution.responseSize !== null ? (
                        <span className="text-sm">{formatBytes(execution.responseSize)}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function statusToClassName(status: ExecutionModel['status']): string {
  const statusColors: Record<ExecutionModel['status'], string> = {
    succeeded: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    timed_out: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    skipped: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  };

  return statusColors[status];
}

function httpStatusToClassName(status: number): string {
  if (status >= 200 && status < 300) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  } else if (status >= 300 && status < 400) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  } else if (status >= 400 && status < 500) {
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
  } else if (status >= 500) {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
}

function formatDuration(start: Date | string, end: Date | string): string {
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);

  const durationMs = endDate.getTime() - startDate.getTime();
  const seconds = Math.floor(durationMs / 1000);
  const milliseconds = durationMs % 1000;

  if (seconds > 0) {
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
  }
  return `${milliseconds}ms`;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
