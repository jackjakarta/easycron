import { getAsyncPageContext, type PageContext } from '@/utils/context';
import { notFound } from 'next/navigation';
import { z } from 'zod';

const pageContextSchema = z.object({
  searchParams: z
    .object({
      project: z.string().optional(),
      stuff: z.string().optional(),
    })
    .strict(),
});

export default async function Page(context: PageContext) {
  const pageContext = await getAsyncPageContext(context);
  const parsed = pageContextSchema.safeParse(pageContext);

  if (!parsed.success) {
    return notFound();
  }

  const { project, stuff } = parsed.data.searchParams;

  if (project === undefined) {
    return <div className="p-6">No project specified</div>;
  }

  return (
    <div className="p-6">
      Project: {project} and {stuff ?? 'no stuff'}
    </div>
  );
}
