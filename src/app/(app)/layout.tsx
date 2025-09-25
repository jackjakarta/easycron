import { getUser } from '@/auth/utils';
import AppSidebar from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
