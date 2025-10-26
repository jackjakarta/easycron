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
                <SidebarMenuButton
                  className="cursor-pointer"
                  size="sm"
                  tooltip="Keyboard Shortcuts"
                >
                  <Command />
                  <span>Shortcuts</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm" tooltip="GitHub Repo">
              <a
                href="https://github.com/jackjakarta/easycron"
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
