import { getUser } from '@/auth/utils';
import { dbGetProjectById } from '@/db/functions/project';
import { getAsyncPageContext, type PageContext } from '@/utils/context';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import { CronJobsTable } from './jobs-table';

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

  return (
    <div className="p-4">
      <CronJobsTable cronJobs={project.jobs} />
    </div>
  );
}
