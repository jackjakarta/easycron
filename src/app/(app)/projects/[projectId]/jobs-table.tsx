'use client';

import ConfirmationDialog from '@/components/common/confirmation-dialog';
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
import { Clock, Globe, MoreHorizontal, Pause, Pencil, Play, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import { deleteJobAction, enableOrDisableJobAction, runJobNowAction } from './actions';
import CreateJobDialog from './create-job-dialog';
import EditJobSheet from './edit-job-sheet';

type CronJobsTableProps = {
  cronJobs: JobModel[];
  projectId: string;
};

export function CronJobsTable({ cronJobs, projectId }: CronJobsTableProps) {
  const router = useRouter();
  const [deletingJobId, setDeletingJobId] = React.useState<string | null>(null);

  async function handleEnableOrDisableJob(jobId: string, enabled: boolean) {
    try {
      await enableOrDisableJobAction({ jobId, enabled });
      toast.success(`Job ${enabled ? 'enabled' : 'disabled'} successfully`);
      router.refresh();
    } catch (error) {
      console.error('Failed to update job:', error);
      toast.error('Failed to update job');
    }
  }

  async function handleRunJobNow(jobId: string) {
    try {
      await runJobNowAction({ jobId });
      toast.success('Job enqueued successfully');
    } catch (error) {
      console.error('Failed to run job now:', error);
      toast.error('Failed to run job now');
    }
  }

  async function handleDeleteJob(jobId: string) {
    setDeletingJobId(jobId);

    try {
      await deleteJobAction({ jobId });
      toast.success('Job deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete job:', error);
      toast.error('Failed to delete job');
    } finally {
      setDeletingJobId(null);
    }
  }

  const sortedJobs = cronJobs.sort((a, b) => Number(b.enabled) - Number(a.enabled));
  const enabledJobs = sortedJobs.filter((job) => job.enabled);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Enabled Jobs ({enabledJobs.length})
          </div>

          {cronJobs.length > 0 && (
            <CreateJobDialog
              projectId={projectId}
              trigger={
                <Button>
                  Create Job
                  <Plus className="size-4" />
                </Button>
              }
            />
          )}
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
              {cronJobs.length > 0 ? (
                cronJobs.map((job) => (
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
                      <Badge variant="outline" className={methodToClassName(job.httpMethod)}>
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
                        {job.enabled ? (
                          <>
                            <div className="text-sm">
                              {formatDistanceToNow(job.nextRunAt, { addSuffix: true })}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {format(job.nextRunAt, 'MMM d, HH:mm')}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm">Never</div>
                        )}
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
                          <EditJobSheet
                            job={job}
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            }
                          />

                          <DropdownMenuItem
                            onSelect={() => handleEnableOrDisableJob(job.id, !job.enabled)}
                          >
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

                          {job.enabled && (
                            <DropdownMenuItem onSelect={() => handleRunJobNow(job.id)}>
                              <Play className="mr-2 h-4 w-4" />
                              Run Now
                            </DropdownMenuItem>
                          )}

                          <ConfirmationDialog
                            title="Delete Job"
                            type="destructive"
                            description="Are you sure you want to delete this job? This action cannot be undone."
                            onConfirm={() => handleDeleteJob(job.id)}
                            isLoading={deletingJobId === job.id}
                            trigger={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="text-destructive mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            }
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 py-8">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Clock className="text-muted-foreground mb-4 h-12 w-12" />
                      <h3 className="text-lg font-semibold">No jobs yet</h3>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Get started by creating your first cron job.
                      </p>
                      <CreateJobDialog
                        projectId={projectId}
                        trigger={
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Job
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function parseCronExpression(cron: string): string {
  const parts = cron.split(' ');

  if (parts.length !== 5) {
    return cron;
  }

  switch (cron) {
    case '* * * * *':
      return 'Every minute';
    case '*/10 * * * *':
      return 'Every 10 minutes';
    case '0 * * * *':
      return 'Hourly at minute 0';
    case '0 2 * * *':
      return 'Daily at 2:00 AM';
    case '0 9 * * 1':
      return 'Weekly on Monday at 9:00 AM';
    case '*/5 * * * *':
      return 'Every 5 minutes';
    case '0 0 1 * *':
      return 'Monthly on the 1st at midnight';
    default:
      return cron;
  }
}

function methodToClassName(method: HttpMethod) {
  const httpMethodColors: Record<HttpMethod, string> = {
    GET: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    POST: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  return httpMethodColors[method];
}
