import { getAsyncPageContext, type PageContext } from '@/utils/context';
import { notFound } from 'next/navigation';
import { z } from 'zod';

const pageContextSchema = z.object({
  params: z.object({
    organizationSlug: z.string(),
  }),
});

export default async function Page(context: PageContext) {
  const pageContext = pageContextSchema.safeParse(await getAsyncPageContext(context));

  if (!pageContext.success) {
    return notFound();
  }

  const { organizationSlug } = pageContext.data.params;

  return (
    <div>
      <h1>Organization Members</h1>
      <p>Organization Slug: {organizationSlug}</p>
    </div>
  );
}
