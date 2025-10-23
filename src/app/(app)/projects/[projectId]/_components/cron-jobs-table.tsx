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
import { describeCronExpression } from '@/utils/cron';
import { cn } from '@/utils/tailwind';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Clock,
  Globe,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCcw,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import { deleteJobAction, enableOrDisableJobAction, runJobNowAction } from '../actions';
import CreateJobDialog from './create-job-dialog';
import EditJobSheet from './edit-job-sheet';
import SecretDialog from './secret-dialog';

type CronJobsTableProps = {
  cronJobs: JobModel[];
  projectId: string;
  secretEnabled: boolean;
};

export default function CronJobsTable({ cronJobs, projectId, secretEnabled }: CronJobsTableProps) {
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
            <div className="flex flex-wrap items-center gap-2">
              <SecretDialog
                projectId={projectId}
                regenerate={secretEnabled}
                trigger={
                  <Button variant="outline">
                    {secretEnabled ? 'Regenerate Secret' : 'Enable Signing'}
                  </Button>
                }
              />

              <CreateJobDialog
                key="create-job-dialog-1"
                projectId={projectId}
                trigger={
                  <Button>
                    Create Job
                    <Plus className="size-4" />
                  </Button>
                }
              />
            </div>
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
              {cronJobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 py-8">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Clock className="text-muted-foreground mb-4 h-12 w-12" />
                      <h3 className="text-lg font-semibold">No jobs yet</h3>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Get started by creating your first cron job.
                      </p>
                      <CreateJobDialog
                        key="create-job-dialog-2"
                        projectId={projectId}
                        trigger={
                          <Button>
                            Create Job
                            <Plus className="size-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {cronJobs.length > 0 &&
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
                          {describeCronExpression(job.scheduleCron)}
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
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <EditJobSheet
                            job={job}
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Pencil className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                            }
                          />

                          <DropdownMenuItem
                            onSelect={() => handleEnableOrDisableJob(job.id, !job.enabled)}
                          >
                            {job.enabled ? (
                              <>
                                <Pause className="mr-2 size-4" />
                                Disable
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 size-4" />
                                Enable
                              </>
                            )}
                          </DropdownMenuItem>

                          {job.enabled && (
                            <DropdownMenuItem onSelect={() => handleRunJobNow(job.id)}>
                              <Play className="mr-2 size-4" />
                              Run Now
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onSelect={() => router.push(`/projects/${projectId}/job/${job.id}`)}
                          >
                            <RefreshCcw className="mr-2 size-4" />
                            Executions
                          </DropdownMenuItem>

                          <ConfirmationDialog
                            title="Delete Job"
                            type="destructive"
                            description={`Are you sure you want to delete ${job.name} ? This action cannot be undone.`}
                            onConfirm={() => handleDeleteJob(job.id)}
                            isLoading={deletingJobId === job.id}
                            trigger={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="text-destructive mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            }
                          />
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

function methodToClassName(method: HttpMethod) {
  const httpMethodColors: Record<HttpMethod, string> = {
    GET: cn('bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'),
    POST: cn('bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'),
    PUT: cn('text-chart-5 bg-chart-5/10 dark:bg-chart-4/10 dark:text-chart-4'),
    DELETE: cn('bg-destructive/10 text-destructive'),
  };

  return httpMethodColors[method];
}
