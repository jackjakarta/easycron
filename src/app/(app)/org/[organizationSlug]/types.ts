import { auth } from '@/auth';

export type BetterAuthOrganization = Awaited<ReturnType<typeof auth.api.getFullOrganization>>;
