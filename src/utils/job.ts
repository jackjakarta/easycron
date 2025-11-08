export function occurrenceJobId(jobId: string, scheduledISO: string, name: string = 'run') {
  const safeISO = scheduledISO.replace(/[:.]/g, '');
  return `${name}-${jobId}-${safeISO}`;
}
