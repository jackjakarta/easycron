import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const rewriteUrl = processRequestForProxy(req);

  if (rewriteUrl !== null) {
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}

function processRequestForProxy(req: NextRequest) {
  const { headers, nextUrl } = req;

  if (nextUrl.pathname.startsWith('/_next') || nextUrl.pathname.startsWith('/api/')) {
    return null;
  }

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

  return null;
}
