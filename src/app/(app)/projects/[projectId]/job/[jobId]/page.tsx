import { getUser } from '@/auth/utils';
import Header from '@/components/common/header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { dbGetFinishedExecutionsByJobId } from '@/db/functions/execution';
import { dbGetExecutionAnalytics } from '@/db/functions/execution-analytics';
import { dbGetJobById } from '@/db/functions/job';
import { getAsyncPageContext, type PageContext } from '@/utils/context';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import ExecutionAnalytics from './execution-analytics';
import ExecutionsTable from './executions-table';

const pageContextSchema = z.object({
  params: z.object({
    projectId: z.uuid(),
    jobId: z.uuid(),
  }),
});

export default async function Page(context: PageContext) {
  const [user, pageContext] = await Promise.all([getUser(), getAsyncPageContext(context)]);
  const parsed = pageContextSchema.safeParse(pageContext);

  if (!parsed.success) {
    return notFound();
  }

  const { jobId, projectId } = parsed.data.params;
  const job = await dbGetJobById({ jobId, organizationId: user.organizationId });

  if (job === undefined) {
    return notFound();
  }

  const [jobExecutions, analytics] = await Promise.all([
    dbGetFinishedExecutionsByJobId({ jobId: job.id }),
    dbGetExecutionAnalytics({ jobId: job.id }),
  ]);

  return (
    <>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={`/projects/${projectId}`}>Jobs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{job.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ExecutionAnalytics jobId={job.id} initialData={analytics} />
        <ExecutionsTable executions={jobExecutions} jobId={job.id} jobName={job.name} />
      </div>
    </>
  );
}
