'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();

export function ClientProvider({
  children,
  sidebarState,
}: {
  children: React.ReactNode;
  sidebarState: boolean;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={sidebarState}>{children}</SidebarProvider>
    </QueryClientProvider>
  );
}
