import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/utils/tailwind';
import { type Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { Geist_Mono, Lato } from 'next/font/google';

import './globals.css';

const latoSans = Lato({
  variable: '--font-lato-sans',
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'easyCron - Free and Open Source Cron Job Manager',
    description:
      'A free and open source cron job manager to schedule and manage your cron jobs with ease.',
    icons: { icon: '/favicon.png' },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn(latoSans.variable, geistMono.variable, 'antialiased')}>
        <ThemeProvider
          defaultTheme="system"
          attribute="class"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            {children}
            <Toaster position="top-right" />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
