import { cookies } from 'next/headers';

import { siteLanguageSchema, type SiteLanguage } from './types';

export async function setCookie(
  name: string,
  value: string,
  options?: { maxAge?: number; path?: string },
) {
  const cookieStore = await cookies();

  const cookieOptions = {
    ...options,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  cookieStore.set({
    name,
    value,
    ...cookieOptions,
  });
}

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

export async function getCookieValue(name: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(name)?.value;

  return cookieValue;
}

export async function getSidebarOpenStateFromCookies(): Promise<boolean> {
  const sidebarState = await getCookieValue('sidebar_state');
  const isSidebarOpen = sidebarState !== undefined ? sidebarState === 'true' : true;

  return isSidebarOpen;
}

export async function getLocaleFromCookies(): Promise<SiteLanguage | undefined> {
  const locale = await getCookieValue('site_language');
  const parsedLocale = siteLanguageSchema.safeParse(locale);

  if (!parsedLocale.success) {
    return undefined;
  }

  return parsedLocale.data;
}
