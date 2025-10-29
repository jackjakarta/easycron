import { dbDeleteOldExecutions } from '@/db/functions/execution';
import { env } from '@/env';
import { NextRequest, NextResponse } from 'next/server';

import { verifyRequestSignature } from '../utils';

export async function DELETE(req: NextRequest) {
  try {
    const signature = req.headers.get('x-easycron-signature');

    if (signature === null) {
      console.error({ success: false, error: 'Missing signature' });
      return NextResponse.json({ success: false, error: 'Missing signature' }, { status: 400 });
    }

    const payload = await req.text();
    const isValid = verifyRequestSignature({
      payload,
      signature,
      secret: env.easyCronWebhookSecret,
    });

    if (!isValid) {
      console.error({ success: isValid, error: 'Invalid signature' });
      return NextResponse.json({ success: isValid, error: 'Invalid signature' }, { status: 400 });
    }

    const deletedCount = await dbDeleteOldExecutions();

    return NextResponse.json({ deletedCount });
  } catch (error) {
    console.error('Error deleting old executions:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
