'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <FileQuestion className="text-primary mx-auto h-16 w-16" />
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <Alert className="border-2">
          <AlertTitle className="text-lg">404</AlertTitle>
          <AlertDescription>
            We could not find the page you were looking for. The page might have been moved,
            deleted, or never existed.
          </AlertDescription>
        </Alert>
        <p className="text-muted-foreground">Check the URL or navigate back to the homepage.</p>
        <Button asChild className="px-8 py-6 text-base" size="lg">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
