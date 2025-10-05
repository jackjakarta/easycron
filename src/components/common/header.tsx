import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

type HeaderProps = {
  children: React.ReactNode;
  showSidebarTrigger?: boolean;
};

export default function Header({ children, showSidebarTrigger = true }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        {showSidebarTrigger && (
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
