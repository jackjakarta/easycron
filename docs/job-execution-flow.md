# Job Execution Flow

This document explains the full lifecycle of an HTTP cron job execution in easyCron, from the moment a job becomes due to the final result being persisted.

## Three-Process Architecture

easyCron runs as three separate processes:

| Process       | Entry point           | Role                                                           |
| ------------- | --------------------- | -------------------------------------------------------------- |
| **Next.js**   | `src/app/`            | Web UI and API routes (CRUD for jobs, projects, orgs, etc.)    |
| **Scheduler** | `scheduler/index.ts`  | Polls the database every 1 s for due jobs and enqueues them    |
| **Worker**    | `worker/index.ts`     | BullMQ consumer that executes the HTTP requests (20 concurrency) |

The scheduler and worker communicate exclusively through a Redis-backed BullMQ queue (`easycron-runs`). They never call each other directly.

---

## 1. Scheduler Loop

**Files:** `scheduler/index.ts`, `scheduler/utils.ts`

The scheduler runs an infinite loop:

```
while (!stopping) {
    tick()
    sleep(1000ms)
}
```

Each `tick()` performs the following:

1. **Query due jobs** - Selects up to **500** jobs from the `job` table where `enabled = true` AND `nextRunAt <= now()`. The `now()` helper (`src/utils/cron.ts`) truncates milliseconds to zero for deterministic comparison.

2. **Acquire a distributed lock** - For each due job, attempts a Redis `SET NX` lock with key `lock:sched:<jobId>:<nextRunAt ISO>` and a **15 s TTL** (`src/utils/locks.ts:tryLock`). This prevents duplicate enqueues when multiple scheduler instances run.

3. **Enqueue to BullMQ** - Adds a `run` job to the `easycron-runs` queue with the payload:
   ```ts
   { jobId: string, scheduledForISO: string }
   ```
   The BullMQ job ID is a deterministic string: `run-<jobId>-<ISO without colons/dots>` (via `occurrenceJobId` in `src/utils/job.ts`), which provides natural deduplication.

4. **Compute next run** - Uses `computeNextRun()` (`src/utils/cron.ts`) which delegates to `cron-parser` with the job's cron expression and timezone to determine the next occurrence.

5. **Update the job row** - Sets `lastRunAt` to the current `nextRunAt` and `nextRunAt` to the newly computed next run time.

---

## 2. BullMQ Queue

**File:** `src/queue/queue.ts`

The queue acts as the bridge between scheduler and worker:

- **Queue name:** `easycron-runs`
- **Connection:** IORedis with `maxRetriesPerRequest: null` and `enableReadyCheck: false` (required by BullMQ)
- **Default job options:** `removeOnComplete: 1000`, `removeOnFail: 1000` (keeps the last 1000 completed/failed jobs in Redis for observability, then auto-prunes)
- **Payload type:** `RunJobPayload { jobId: string, scheduledForISO: string }`
- **Priority:** Jobs are enqueued with `priority: 2`

---

## 3. Worker Execution

**Files:** `worker/index.ts`, `worker/run.ts`

The worker is a BullMQ `Worker` with **20 concurrent** processors. When a job is dequeued, `runOnce(bullJob)` executes:

### 3.1 Pre-flight Checks

1. **Load the job row** - Fetches the job from the database via `dbGetJobForWorker()`. If the job no longer exists, the run is silently skipped.
2. **Check enabled** - If `job.enabled === false`, the run is skipped.
3. **Resolve the org owner** - Looks up the organization owner via `dbGetOrganizationOwnerId()`.
4. **Check subscription quota** - Fetches the owner's active Stripe subscription and the current month's execution count in parallel. If `executionsThisMonth >= subscription.limits.executionsPerMonth`, the run is skipped.

### 3.2 HTTP Execution with Retries

The worker attempts the HTTP request up to `1 + job.maxRetries` times (default: 3 total attempts).

For each attempt:

1. Call `executeHttp()` (see section 4 below).
2. If the response status is `2xx` or `3xx` → mark as `succeeded`, break out of the retry loop.
3. If the response status is `4xx` or `5xx` → mark as `failed`, continue to next attempt.
4. If an exception is thrown:
   - `AbortError` → status = `timed_out`
   - Any other error → status = `failed`
5. **Backoff before retry** (see section 5 below).

### 3.3 Webhook Notifications

After each HTTP attempt (success or failure), the worker checks for registered webhook endpoints:

1. Queries `dbGetWebhookEndpointsForEvent()` for the event type (`job.execution.completed` or `job.execution.failed`).
2. If endpoints exist, inserts a `webhookEvent` record via `dbInsertWebhookEvent()`.
3. Delivers the webhook to all endpoints in parallel via `POST` with:
   - `Content-Type: application/json`
   - `X-Easycron-Signature: sha256=<HMAC>` (if an HMAC secret is configured)
   - Body: `{ eventType, projectId, userId, payload }`
   - 2 s timeout via `AbortSignal.timeout(2000)`
4. Delivery failures are logged but do not affect job execution status.

### 3.4 Result Persistence

After all attempts are exhausted (or the job succeeds), the worker:

1. **Inserts an execution record** into the `execution` table with:
   - `id` - pre-generated UUID
   - `jobId`, `scheduledFor`, `startedAt`, `finishedAt`
   - `attempt` - final attempt number
   - `status` - one of `succeeded`, `failed`, `timed_out`, `skipped`
   - `httpStatus` - HTTP response code (null if timed out / errored)
   - `latencyMs` - round-trip time
   - `requestSize` - byte length of the request body
   - `responseSize` - total bytes received
   - `responseTruncated` - `true` if the response preview hit the 4 KB cap
   - `errorMessage` - error string (null on success)
   - `responsePreview` - first 4 KB of the response body

2. **Updates the job row:**
   - `consecutiveFailures` - reset to `0` on success, incremented by `1` on failure
   - `lastRunAt` - set to the current timestamp

---

## 4. HTTP Execution Details

**File:** `src/utils/http.ts`

The `executeHttp()` function handles the actual outbound HTTP call:

### Request Construction

1. Merges user-defined headers (`{ k, v }` pairs) into a headers object.
2. Adds `X-Easycron-Run-Id: <runId>` so target servers can correlate requests.
3. If an HMAC secret is configured for the project, computes `HMAC-SHA256(secret, body)` and adds `X-Easycron-Signature: sha256=<hex digest>`.
4. If an authorization header is configured, it is added last (can override user headers).

### Request Execution

- Uses **undici** `request()` for high-performance HTTP.
- Timeout is enforced via an `AbortController` with `setTimeout`. The same timeout value is also passed as `bodyTimeout` and `headersTimeout` to undici.
- Default timeout: **3214 ms** (overridden by the job's `timeoutMs`, which defaults to **10000 ms** in the schema).

### Response Streaming

The response body is streamed (not buffered in full):

- Captures up to **4096 bytes** (4 KB) of the response for the preview.
- Tracks total `responseSize` (bytes received).
- Stops reading after **16 KB** (`cap * 4`) to bound memory usage for very large responses.

### Return Value

```ts
{
  statusCode: number;    // HTTP status code
  latencyMs: number;     // wall-clock time from request start to body consumed
  responsePreview: string; // first 4 KB of the response as UTF-8
  responseSize: number;  // total bytes received
}
```

---

## 5. Retry and Backoff Strategy

When an attempt fails and retries remain, the worker sleeps before the next attempt:

```
sleepMs = floor(backoffInitialMs * backoffFactor^(attempt - 1)) + random(0, jitterMs)
sleepMs = min(sleepMs, 60000)  // capped at 60 seconds
```

**Default values** (from the `job` table schema):

| Parameter          | Default  |
| ------------------ | -------- |
| `maxRetries`       | 2        |
| `backoffInitialMs` | 5000 ms  |
| `backoffFactor`    | 2.0      |
| `jitterMs`         | 500 ms   |

This means with defaults, the delays are approximately:

| Attempt | Delay before attempt               |
| ------- | ---------------------------------- |
| 1       | (none - immediate)                 |
| 2       | ~5 s + jitter (0-500 ms)           |
| 3       | ~10 s + jitter (0-500 ms)          |

---

## 6. End-to-End Sequence

```
                  ┌──────────┐
                  │ Database │
                  └────┬─────┘
                       │
          1. SELECT due jobs (nextRunAt <= now)
                       │
                  ┌────▼─────┐       2. SET NX lock
                  │Scheduler │──────────────────┐
                  └────┬─────┘                  │
                       │                   ┌────▼────┐
          3. queue.add('run', payload)     │  Redis  │
                       │                   └────┬────┘
                       │                        │
          4. UPDATE nextRunAt              5. Dequeue
                       │                        │
                  ┌────▼─────┐            ┌─────▼────┐
                  │ Database │            │  Worker  │
                  └──────────┘            └─────┬────┘
                                                │
                                  6. Pre-flight checks
                                  7. executeHttp() + retries
                                  8. INSERT execution record
                                  9. UPDATE job (consecutiveFailures)
                                  10. Deliver webhooks
```

## 7. Key Files Reference

| File                      | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `scheduler/index.ts`      | Scheduler process entry point and loop         |
| `scheduler/utils.ts`      | `tick()` function (poll + enqueue logic)        |
| `worker/index.ts`         | Worker process entry point (BullMQ Worker)     |
| `worker/run.ts`           | `runOnce()` - full execution pipeline          |
| `src/utils/http.ts`       | `executeHttp()` - outbound HTTP via undici     |
| `src/queue/queue.ts`      | BullMQ queue config and connection             |
| `src/utils/cron.ts`       | `computeNextRun()` and `now()`                 |
| `src/utils/locks.ts`      | `tryLock()` Redis distributed lock             |
| `src/utils/job.ts`        | `occurrenceJobId()` dedup key generation       |
| `src/db/schema.ts`        | `jobTable`, `executionTable` definitions       |
