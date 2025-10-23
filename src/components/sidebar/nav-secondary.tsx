import ShortcutsDialog from '@/components/common/shortcuts-dialog';
import GithubIcon from '@/components/icons/github';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Command } from 'lucide-react';

export default function NavSecondary({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <ShortcutsDialog
              trigger={
                <SidebarMenuButton className="cursor-pointer" size="sm">
                  <Command />
                  <span>Shortcuts</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm">
              <a
                href="https://github.com/jackjakarta/pdf-exporter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon />
                <span>Github</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
