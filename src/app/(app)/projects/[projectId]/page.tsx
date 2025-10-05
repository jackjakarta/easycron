import { getUser } from '@/auth/utils';
import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import { dbGetProjectById } from '@/db/functions/project';
import { dbGetSecretByProjectId } from '@/db/functions/secret';
import { getAsyncPageContext, type PageContext } from '@/utils/context';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import CronJobsTable from './_components/cron-jobs-table';

const pageContextSchema = z.object({
  params: z.object({
    projectId: z.uuid(),
  }),
});

export default async function Page(context: PageContext) {
  const [user, pageContext] = await Promise.all([getUser(), getAsyncPageContext(context)]);
  const parsed = pageContextSchema.safeParse(pageContext);

  if (!parsed.success) {
    return notFound();
  }

  const { projectId } = parsed.data.params;
  const project = await dbGetProjectById({ projectId, userId: user.id });

  if (project === undefined) {
    return notFound();
  }

  const secret = await dbGetSecretByProjectId({ projectId: project.id, userId: user.id });

  return (
    <>
      <Header>
        <CustomBreadcrumbs
          current={project.name}
          trail={[{ name: 'Projects', href: '/projects' }]}
        />
      </Header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CronJobsTable
          cronJobs={project.jobs}
          projectId={project.id}
          secretEnabled={secret !== undefined}
        />
      </div>
    </>
  );
}
