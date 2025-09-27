import crypto from 'crypto';

import { JobRequestHeaders } from '@/db/schema';
import { request } from 'undici';

export type OutboundRequest = {
  method: string;
  url: string;
  headers: JobRequestHeaders[];
  body?: string | null;
  timeoutMs: number;
  runId: string; // UUID for idempotency header
  hmacSecret?: string | null;
};

export type OutboundResponse = {
  statusCode: number;
  latencyMs: number;
  responsePreview: string;
  responseSize: number;
};

const RUN_DEFAULT_TIMEOUT_MS = 3214;
const RUN_MAX_RESPONSE_PREVIEW_BYTES = 4096;

export async function executeHttp(req: OutboundRequest): Promise<OutboundResponse> {
  const start = Date.now();
  const headers: Record<string, string> = {};

  for (const { k, v } of req.headers ?? []) {
    if (k && v) headers[k] = v;
  }

  headers['X-Easycron-Run-Id'] = req.runId;

  if (req.hmacSecret) {
    const sig = crypto
      .createHmac('sha256', req.hmacSecret)
      .update(req.body ?? '')
      .digest('hex');

    headers['X-Easycron-Signature'] = `sha256=${sig}`;
  }

  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), req.timeoutMs || RUN_DEFAULT_TIMEOUT_MS);

  try {
    const res = await request(req.url, {
      method: req.method,
      headers,
      body: req.body ?? undefined,
      bodyTimeout: req.timeoutMs || RUN_DEFAULT_TIMEOUT_MS,
      headersTimeout: req.timeoutMs || RUN_DEFAULT_TIMEOUT_MS,
      signal: controller.signal,
      // maxRedirections: 3,
    });

    const chunks: Buffer[] = [];
    let bytes = 0;
    const cap = RUN_MAX_RESPONSE_PREVIEW_BYTES;

    for await (const chunk of res.body) {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      bytes += buf.length;
      if (Buffer.concat(chunks).length < cap) {
        const remaining = cap - Buffer.concat(chunks).length;
        chunks.push(buf.slice(0, Math.max(0, remaining)));
      }
      if (bytes >= cap * 4) {
        // stop reading very large responses to save memory
        break;
      }
    }

    const preview = Buffer.concat(chunks).toString('utf8');
    const latencyMs = Date.now() - start;

    clearTimeout(to);
    return {
      statusCode: res.statusCode,
      latencyMs,
      responsePreview: preview,
      responseSize: bytes,
    };
  } catch (e) {
    clearTimeout(to);
    throw e;
  }
}
