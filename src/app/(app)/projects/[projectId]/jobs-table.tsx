'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type HttpMethod, type JobModel } from '@/db/schema';
import { format, formatDistanceToNow } from 'date-fns';
import { Clock, Globe, MoreHorizontal, Pause, Play, Trash2 } from 'lucide-react';

type CronJob = Pick<
  JobModel,
  'id' | 'name' | 'enabled' | 'scheduleCron' | 'timezone' | 'httpMethod' | 'lastRunAt' | 'nextRunAt'
>;

type CronJobsTableProps = {
  cronJobs: CronJob[];
};

const httpMethodColors: Record<HttpMethod, string> = {
  GET: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  POST: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  // PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  // DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  // PATCH: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

function parseCronExpression(cron: string): string {
  const parts = cron.split(' ');
  if (parts.length !== 5) return cron;

  const [minute, hour, day, month, dayOfWeek] = parts;

  if (cron === '0 2 * * *') return 'Daily at 2:00 AM';
  if (cron === '0 9 * * 1') return 'Weekly on Monday at 9:00 AM';
  if (cron === '*/5 * * * *') return 'Every 5 minutes';
  if (cron === '0 0 1 * *') return 'Monthly on the 1st at midnight';

  return cron;
}

export function CronJobsTable({ cronJobs }: CronJobsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Scheduled Jobs ({cronJobs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Timezone</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cronJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={job.enabled ? 'default' : 'secondary'}
                      className={
                        job.enabled
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }
                    >
                      {job.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-mono text-sm">{job.scheduleCron}</div>
                      <div className="text-muted-foreground text-xs">
                        {parseCronExpression(job.scheduleCron)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={httpMethodColors[job.httpMethod]}>
                      {job.httpMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Globe className="text-muted-foreground h-3 w-3" />
                      <span className="text-sm">{job.timezone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {job.lastRunAt ? (
                      <div className="space-y-1">
                        <div className="text-sm">
                          {formatDistanceToNow(job.lastRunAt, { addSuffix: true })}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {format(job.lastRunAt, 'MMM d, HH:mm')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {formatDistanceToNow(job.nextRunAt, { addSuffix: true })}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {format(job.nextRunAt, 'MMM d, HH:mm')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          {job.enabled ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Disable
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Enable
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Play className="mr-2 h-4 w-4" />
                          Run Now
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
