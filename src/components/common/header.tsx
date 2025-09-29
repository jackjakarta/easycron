import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

type HeaderProps = {
  children: React.ReactNode;
  withSidebarTrigger?: boolean;
};

export default function Header({ children, withSidebarTrigger = true }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        {withSidebarTrigger && (
          <>
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          </>
        )}
        {children}
      </div>
    </header>
  );
}
