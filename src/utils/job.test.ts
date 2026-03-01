import { describe, expect, it } from 'vitest';

import { occurrenceJobId } from './job';

describe('occurrenceJobId', () => {
  it('should generate correct ID with default name', () => {
    const jobId = 'job-123';
    const scheduledISO = '2023-12-25T10:30:45.123Z';
    const result = occurrenceJobId(jobId, scheduledISO);

    expect(result).toBe('run-job-123-2023-12-25T103045123Z');
  });

  it('should generate correct ID with custom name', () => {
    const jobId = 'job-456';
    const scheduledISO = '2023-06-15T14:20:30.456Z';
    const name = 'execute';
    const result = occurrenceJobId(jobId, scheduledISO, name);

    expect(result).toBe('execute-job-456-2023-06-15T142030456Z');
  });

  it('should handle ISO string without milliseconds', () => {
    const jobId = 'simple-job';
    const scheduledISO = '2023-01-01T00:00:00Z';
    const result = occurrenceJobId(jobId, scheduledISO);

    expect(result).toBe('run-simple-job-2023-01-01T000000Z');
  });

  it('should handle ISO string with timezone offset', () => {
    const jobId = 'tz-job';
    const scheduledISO = '2023-07-04T15:30:00+02:00';
    const result = occurrenceJobId(jobId, scheduledISO);

    expect(result).toBe('run-tz-job-2023-07-04T153000+0200');
  });

  it('should handle ISO string with negative timezone offset', () => {
    const jobId = 'negative-tz-job';
    const scheduledISO = '2023-11-11T09:15:30-05:00';
    const result = occurrenceJobId(jobId, scheduledISO);

    expect(result).toBe('run-negative-tz-job-2023-11-11T091530-0500');
  });

  it('should remove all colons and dots from ISO string', () => {
    const jobId = 'complex-job';
    const scheduledISO = '2023-12-31T23:59:59.999Z';
    const result = occurrenceJobId(jobId, scheduledISO);

    expect(result).toBe('run-complex-job-2023-12-31T235959999Z');
  });

  it('should handle job IDs with special characters', () => {
    const jobId = 'job-with-dashes_and_underscores.123';
    const scheduledISO = '2023-08-15T12:00:00.000Z';
    const result = occurrenceJobId(jobId, scheduledISO);

    expect(result).toBe('run-job-with-dashes_and_underscores.123-2023-08-15T120000000Z');
  });

  it('should handle empty custom name by using it as provided', () => {
    const jobId = 'test-job';
    const scheduledISO = '2023-05-20T16:45:30.000Z';
    const name = '';
    const result = occurrenceJobId(jobId, scheduledISO, name);

    expect(result).toBe('-test-job-2023-05-20T164530000Z');
  });

  it('should handle very long job IDs', () => {
    const jobId = 'a'.repeat(100);
    const scheduledISO = '2023-03-10T08:30:00.123Z';
    const result = occurrenceJobId(jobId, scheduledISO);

    expect(result).toBe(`run-${'a'.repeat(100)}-2023-03-10T083000123Z`);
  });

  it('should handle leap year date', () => {
    const jobId = 'leap-year-job';
    const scheduledISO = '2024-02-29T12:00:00.000Z';
    const result = occurrenceJobId(jobId, scheduledISO);

    expect(result).toBe('run-leap-year-job-2024-02-29T120000000Z');
  });

  it('should handle start of year date', () => {
    const jobId = 'new-year-job';
    const scheduledISO = '2024-01-01T00:00:01.001Z';
    const result = occurrenceJobId(jobId, scheduledISO);

    expect(result).toBe('run-new-year-job-2024-01-01T000001001Z');
  });

  it('should handle end of year date', () => {
    const jobId = 'year-end-job';
    const scheduledISO = '2023-12-31T23:59:59.999Z';
    const result = occurrenceJobId(jobId, scheduledISO);

    expect(result).toBe('run-year-end-job-2023-12-31T235959999Z');
  });

  it('should handle custom names with special characters', () => {
    const jobId = 'job-123';
    const scheduledISO = '2023-06-15T10:30:00.000Z';
    const name = 'background-task_v2.1';
    const result = occurrenceJobId(jobId, scheduledISO, name);

    expect(result).toBe('background-task_v2.1-job-123-2023-06-15T103000000Z');
  });

  it('should generate unique IDs for same job at different times', () => {
    const jobId = 'recurring-job';
    const time1 = '2023-06-15T10:30:00.000Z';
    const time2 = '2023-06-15T10:30:01.000Z';

    const result1 = occurrenceJobId(jobId, time1);
    const result2 = occurrenceJobId(jobId, time2);

    expect(result1).toBe('run-recurring-job-2023-06-15T103000000Z');
    expect(result2).toBe('run-recurring-job-2023-06-15T103001000Z');
    expect(result1).not.toBe(result2);
  });

  it('should generate unique IDs for different jobs at same time', () => {
    const scheduledISO = '2023-06-15T10:30:00.000Z';
    const jobId1 = 'job-1';
    const jobId2 = 'job-2';

    const result1 = occurrenceJobId(jobId1, scheduledISO);
    const result2 = occurrenceJobId(jobId2, scheduledISO);

    expect(result1).toBe('run-job-1-2023-06-15T103000000Z');
    expect(result2).toBe('run-job-2-2023-06-15T103000000Z');
    expect(result1).not.toBe(result2);
  });

  it('should handle microseconds in ISO string', () => {
    const jobId = 'micro-job';
    const scheduledISO = '2023-08-20T14:25:35.123456Z';
    const result = occurrenceJobId(jobId, scheduledISO);

    expect(result).toBe('run-micro-job-2023-08-20T142535123456Z');
  });

  it('should be consistent when called multiple times with same parameters', () => {
    const jobId = 'consistent-job';
    const scheduledISO = '2023-09-10T16:45:30.500Z';
    const name = 'process';

    const result1 = occurrenceJobId(jobId, scheduledISO, name);
    const result2 = occurrenceJobId(jobId, scheduledISO, name);
    const result3 = occurrenceJobId(jobId, scheduledISO, name);

    expect(result1).toBe('process-consistent-job-2023-09-10T164530500Z');
    expect(result1).toBe(result2);
    expect(result2).toBe(result3);
  });
});
