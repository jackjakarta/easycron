'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, LogOut, Plus } from 'lucide-react';

export function OrgHeader({ onNewOrg }: { onNewOrg: () => void }) {
  return (
    <header className="border-border flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary-foreground h-4 w-4"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 3h12l4 6-10 13L2 9z" />
          </svg>
        </div>
        <span className="text-foreground text-sm font-semibold tracking-tight">Acme Inc</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onNewOrg}>
          <Plus className="h-3.5 w-3.5" />
          New organization
        </Button>

        <button
          type="button"
          className="text-muted-foreground hover:bg-accent hover:text-foreground relative flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="bg-primary absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ring-border hover:ring-primary/50 flex h-8 w-8 items-center justify-center rounded-full ring-1 transition-colors"
              aria-label="User menu"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-secondary text-foreground text-xs font-medium">
                  JD
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-2">
              <p className="text-foreground text-sm font-medium">John Doe</p>
              <p className="text-muted-foreground text-xs">john@acme.io</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Account settings</DropdownMenuItem>
            <DropdownMenuItem>Theme</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
