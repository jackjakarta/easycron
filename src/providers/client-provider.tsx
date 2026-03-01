'use client';

import CreateProjectDialog from '@/app/(app)/projects/create-project-dialog';
import ShortcutsDialog from '@/components/common/shortcuts-dialog';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();

export default function ClientProvider({
  children,
  sidebarState,
}: {
  children: React.ReactNode;
  sidebarState: boolean;
}) {
  const shortcutsDialogRef = React.useRef<HTMLButtonElement | null>(null);
  const createProjectRef = React.useRef<HTMLButtonElement | null>(null);

  useKeyboardShortcut({
    key: '/',
    callbackFn: () => shortcutsDialogRef.current?.click(),
  });

  useKeyboardShortcut({
    key: 'o',
    withShift: true,
    callbackFn: () => createProjectRef.current?.click(),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={sidebarState}>
        {children}
        <ShortcutsDialog hidden buttonRef={shortcutsDialogRef} />
        <CreateProjectDialog hidden buttonRef={createProjectRef} />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
