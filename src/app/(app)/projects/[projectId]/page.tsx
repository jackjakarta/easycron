import { getUser } from '@/auth/utils';
import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';
import PageContainer from '@/components/layout/page-container';
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
  const project = await dbGetProjectById({ projectId, organizationId: user.organizationId });

  if (project === undefined) {
    return notFound();
  }

  const secret = await dbGetSecretByProjectId({
    projectId: project.id,
    organizationId: user.organizationId,
  });

  return (
    <>
      <Header>
        <CustomBreadcrumbs
          current={project.name}
          trail={[{ name: 'Projects', href: '/projects' }]}
        />
      </Header>
      <PageContainer wide>
        <CronJobsTable
          cronJobs={project.jobs}
          project={project}
          secretEnabled={secret !== undefined}
        />
      </PageContainer>
    </>
  );
}
