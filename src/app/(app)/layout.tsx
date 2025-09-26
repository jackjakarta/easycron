import { getUser } from '@/auth/utils';
import AppSidebar from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getSidebarOpenStateFromCookies } from '@/utils/cookies';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [user, sidebarState] = await Promise.all([getUser(), getSidebarOpenStateFromCookies()]);

  return (
    <SidebarProvider defaultOpen={sidebarState}>
      <AppSidebar user={user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
