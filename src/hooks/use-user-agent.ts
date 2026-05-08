import { authClient } from '@/auth/client';
import Bowser from 'bowser';
import React from 'react';

type UAInfo = {
  userAgent: string;
  osName: string | null;
  browserName: string | null;
  isMacOs: boolean;
  isWindows: boolean;
  isSafari: boolean;
  isFirefox: boolean;
  isChrome: boolean;
  isBrave: boolean;
  isEdge: boolean;
  ready: boolean;
};

export function useUserAgent(): UAInfo {
  const { data } = authClient.useSession();
  const sessionUA = data?.session?.userAgent?.trim() ?? null;

  const [ua, setUa] = React.useState<string | null>(sessionUA);

  React.useEffect(() => {
    if (ua === null && typeof navigator !== 'undefined') {
      const navUA = navigator.userAgent.trim();

      if (navUA) {
        setUa(navUA);
      }
    }
  }, [ua]);

  const parsed = React.useMemo(() => {
    if (ua === null) {
      return null;
    }

    try {
      const parser = Bowser.getParser(ua);
      const osName = parser.getOSName();
      const browserName = parser.getBrowserName();
      const isMacOs = osName === 'macOS';
      const isWindows = osName === 'Windows';
      const isSafari = browserName === 'Safari';
      const isFirefox = browserName === 'Firefox';
      const isChrome = ['Chrome', 'Chromium'].includes(browserName);
      const isBrave = browserName === 'Brave';
      const isEdge = browserName === 'Microsoft Edge';

      return {
        parsedUserAgent: parser.parse(),
        osName,
        browserName,
        isMacOs,
        isWindows,
        isSafari,
        isFirefox,
        isChrome,
        isBrave,
        isEdge,
      };
    } catch {
      return null;
    }
  }, [ua]);

  return {
    userAgent: ua ?? '',
    osName: parsed?.osName ?? null,
    browserName: parsed?.browserName ?? null,
    isMacOs: parsed?.isMacOs ?? false,
    isWindows: parsed?.isWindows ?? false,
    isSafari: parsed?.isSafari ?? false,
    isFirefox: parsed?.isFirefox ?? false,
    isChrome: parsed?.isChrome ?? false,
    isBrave: parsed?.isBrave ?? false,
    isEdge: parsed?.isEdge ?? false,
    ready: Boolean(ua && parsed),
  };
}
