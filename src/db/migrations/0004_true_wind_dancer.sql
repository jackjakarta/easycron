CREATE MATERIALIZED VIEW "app"."execution_hourly_stats" AS
SELECT
  e.job_id,
  date_trunc('hour', e.started_at) AS bucket,
  COUNT(*)::int AS total_count,
  COUNT(*) FILTER (WHERE e.status = 'succeeded')::int AS succeeded_count,
  COUNT(*) FILTER (WHERE e.status = 'failed')::int AS failed_count,
  COUNT(*) FILTER (WHERE e.status = 'timed_out')::int AS timed_out_count,
  COUNT(*) FILTER (WHERE e.status = 'skipped')::int AS skipped_count,
  ROUND(AVG(e.latency_ms)::numeric, 2) AS avg_latency_ms,
  ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY e.latency_ms)::numeric, 2) AS p95_latency_ms,
  ROUND(PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY e.latency_ms)::numeric, 2) AS p99_latency_ms,
  MIN(e.latency_ms) AS min_latency_ms,
  MAX(e.latency_ms) AS max_latency_ms,
  ROUND(AVG(e.response_size)::numeric, 2) AS avg_response_size
FROM "app"."execution" e
WHERE e.finished_at IS NOT NULL
GROUP BY e.job_id, date_trunc('hour', e.started_at)
WITH DATA;--> statement-breakpoint
CREATE UNIQUE INDEX "exec_hourly_stats_job_bucket_idx" ON "app"."execution_hourly_stats" ("job_id", "bucket");--> statement-breakpoint
CREATE INDEX "exec_hourly_stats_job_id_idx" ON "app"."execution_hourly_stats" ("job_id");
