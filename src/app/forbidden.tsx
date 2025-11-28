'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { TypographyH1, TypographyP } from '@/components/ui/typography';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function Forbidden() {
  const t = useTranslations('error-pages.forbidden');

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <AlertCircle className="text-destructive mx-auto h-16 w-16" />
        <TypographyH1 className="text-3xl font-bold tracking-tight">{t('heading')}</TypographyH1>
        <Alert variant="destructive" className="border-2">
          <AlertTitle className="text-lg">{t('title')}</AlertTitle>
          <AlertDescription>{t('description')}</AlertDescription>
        </Alert>
        <TypographyP className="text-muted-foreground">{t('sub-description')}</TypographyP>
        <Button onClick={() => window.history.back()} className="px-8 py-6 text-base" size="lg">
          <RefreshCw className="mr-2 h-5 w-5" />
          {t('button')}
        </Button>
      </div>
    </div>
  );
}
