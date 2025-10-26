import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const headers = req.headers;
  const xApiKey = headers.get('x-api-key');
  console.debug('Health check received. X-API-Key:', xApiKey);

  return NextResponse.json('Ok', { status: 200, statusText: 'Ok' });
}
