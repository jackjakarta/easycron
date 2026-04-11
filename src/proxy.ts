import { NextRequest, NextResponse } from 'next/server';

import { processRequestForProxy } from './utils/host';

export function proxy(req: NextRequest) {
  const rewriteUrl = processRequestForProxy(req);

  if (rewriteUrl !== null) {
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}
