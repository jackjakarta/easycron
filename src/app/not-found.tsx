'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations('error-pages.not-found');

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <FileQuestion className="text-primary mx-auto h-16 w-16" />
        <h1 className="text-3xl font-bold tracking-tight">{t('heading')}</h1>
        <Alert className="border-2">
          <AlertTitle className="text-lg">{t('title')}</AlertTitle>
          <AlertDescription>{t('description')}</AlertDescription>
        </Alert>
        <p className="text-muted-foreground">{t('sub-description')}</p>
        <Button asChild className="px-8 py-6 text-base" size="lg">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            {t('button')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
