import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyRequestSignature } from '../utils';

const secret = 'whsec_VUZPMFh2R8jSjB6cCCgmW1eHDOQtj06qt8majCugLO';

const responseSchema = z.object({
  ok: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-easycron-signature');

  if (signature === null) {
    console.error({ success: false, error: 'Missing signature' });
    return NextResponse.json({ success: false, error: 'Missing signature' }, { status: 400 });
  }

  const payload = await req.text();
  const isValid = verifyRequestSignature({ payload, signature, secret });

  if (!isValid) {
    console.error({ success: isValid, error: 'Invalid signature' });
    return NextResponse.json({ success: isValid, error: 'Invalid signature' }, { status: 400 });
  }

  const json = JSON.parse(payload);
  const parsed = responseSchema.safeParse(json);

  if (!parsed.success) {
    console.error({ success: false, error: parsed.error.issues });
    return NextResponse.json({ success: false, error: parsed.error.issues }, { status: 400 });
  }

  console.debug({ success: isValid, data: parsed.data });

  return NextResponse.json({ success: isValid, data: parsed.data }, { status: 200 });
}
