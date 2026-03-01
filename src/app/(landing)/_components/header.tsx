'use client';

import { authClient } from '@/auth/client';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header className="border-border bg-card border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Clock className="text-card-foreground size-6" />
          <span className="text-card-foreground font-mono text-xl font-bold">easyCron</span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-muted-foreground hover:text-card-foreground text-sm transition-colors"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-muted-foreground hover:text-card-foreground text-sm transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className="text-muted-foreground hover:text-card-foreground text-sm transition-colors"
          >
            Developers
          </Link>
        </nav>
        {session === null ? (
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
