import { type NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const rewriteUrl = getProxyRewriteUrl(req);

  if (rewriteUrl !== null) {
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};

function getProxyRewriteUrl(req: NextRequest): NextURL | null {
  const { headers, nextUrl } = req;
  const hostname = headers.get('host');

  if (hostname === null) {
    return null;
  }

  if (hostname.startsWith('api.')) {
    const url = nextUrl.clone();

    const _pathname = nextUrl.pathname === '/' ? '' : nextUrl.pathname;
    url.pathname = `/platform-api${_pathname}`;

    return url;
  }

  if (hostname.startsWith('docs.')) {
    const url = nextUrl.clone();

    const _pathname = nextUrl.pathname === '/' ? '' : nextUrl.pathname;
    url.pathname = `/docs${_pathname}`;

    return url;
  }

  return null;
}
