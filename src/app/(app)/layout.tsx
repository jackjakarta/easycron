import { getUser } from '@/auth/utils';
import AppSidebar from '@/components/sidebar/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { ClientProvider } from '@/providers/client-provider';
import { getSidebarOpenStateFromCookies } from '@/utils/cookies';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [user, sidebarState] = await Promise.all([getUser(), getSidebarOpenStateFromCookies()]);

  return (
    <ClientProvider sidebarState={sidebarState}>
      <AppSidebar user={user} />
      <SidebarInset>{children}</SidebarInset>
    </ClientProvider>
  );
}
