'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TypographyH3, TypographyP } from '@/components/ui/typography';
import { ArrowRight, Briefcase } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type JobStatus = 'active' | 'paused' | 'error';

type Job = {
  id: string;
  name: string;
  projectName: string;
  status: JobStatus;
  schedule: string;
  nextRun: Date | null;
  lastRun: Date | null;
};

type JobsOverviewProps = {
  jobs: Job[];
};

export function JobsOverview({ jobs }: JobsOverviewProps) {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');

  const activeJobs = jobs.filter((job) => job.status === 'active');
  const pausedJobs = jobs.filter((job) => job.status === 'paused');
  const errorJobs = jobs.filter((job) => job.status === 'error');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          {t('jobs-overview')}
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/jobs">
            {tCommon('view-all')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm">
              <span className="font-semibold">{activeJobs.length}</span> {t('active')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-400" />
            <span className="text-sm">
              <span className="font-semibold">{pausedJobs.length}</span> {t('paused')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-sm">
              <span className="font-semibold">{errorJobs.length}</span> {t('error')}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {jobs.length > 0 ? (
            jobs.slice(0, 5).map((job) => (
              <div
                key={job.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <div className="flex flex-1 items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      job.status === 'active'
                        ? 'bg-green-500'
                        : job.status === 'error'
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <TypographyP className="text-sm font-medium">{job.name}</TypographyP>
                      <span className="text-muted-foreground text-xs">·</span>
                      <TypographyP className="text-muted-foreground text-xs">
                        {job.projectName}
                      </TypographyP>
                    </div>
                    <TypographyP className="text-muted-foreground text-xs">
                      {job.schedule}
                    </TypographyP>
                  </div>
                </div>
                <div className="text-right">
                  {job.nextRun && (
                    <p className="text-muted-foreground text-xs">
                      {tCommon('next')}:{' '}
                      {new Date(job.nextRun).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="text-muted-foreground mb-4 h-12 w-12" />
              <TypographyH3 className="text-lg font-semibold">{t('no-jobs')}</TypographyH3>
              <TypographyP className="text-muted-foreground text-sm">
                {t('create-first-job')}
              </TypographyP>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
