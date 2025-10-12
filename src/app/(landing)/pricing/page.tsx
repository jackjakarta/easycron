import { getMaybeSession } from '@/auth/utils';

import Page2 from './page2';

export default async function Page() {
  const session = await getMaybeSession();

  return <Page2 session={session} />;
}
