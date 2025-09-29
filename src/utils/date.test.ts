import { describe, expect, it } from 'vitest';

import { formatDateToDayMonthYear } from './date';

describe('formatDateToDayMonthYear', () => {
  it('should format a Date object with default parameters', () => {
    const date = new Date('2023-12-25T10:30:00Z');
    const result = formatDateToDayMonthYear(date);

    expect(result).toBe('25.12.2023');
  });

  it('should format a date string with default parameters', () => {
    const result = formatDateToDayMonthYear('2023-01-15T08:45:00Z');

    expect(result).toBe('15.01.2023');
  });

  it('should format a timestamp number with default parameters', () => {
    const timestamp = new Date('2023-06-30T14:20:00Z').getTime();
    const result = formatDateToDayMonthYear(timestamp);

    expect(result).toBe('30.06.2023');
  });

  it('should format date with custom timezone', () => {
    const date = new Date('2023-12-31T23:30:00Z');
    const result = formatDateToDayMonthYear(date, 'America/New_York');

    // New York is UTC-5 in winter, so 23:30 UTC becomes 18:30 same day
    expect(result).toBe('31.12.2023');
  });

  it('should format date with timezone that changes the day', () => {
    const date = new Date('2023-07-01T02:30:00Z');
    const result = formatDateToDayMonthYear(date, 'Asia/Tokyo');

    // Tokyo is UTC+9, so 02:30 UTC becomes 11:30 same day
    expect(result).toBe('01.07.2023');
  });

  it('should format date with timezone that goes to previous day', () => {
    const date = new Date('2023-07-01T02:30:00Z');
    const result = formatDateToDayMonthYear(date, 'America/Los_Angeles');

    // Los Angeles is UTC-7 in summer, so 02:30 UTC becomes 19:30 previous day
    expect(result).toBe('30.06.2023');
  });

  it('should format date with custom locale (US format)', () => {
    const date = new Date('2023-12-25T10:30:00Z');
    const result = formatDateToDayMonthYear(date, 'Europe/Berlin', 'en-US');

    expect(result).toBe('12/25/2023');
  });

  it('should format date with custom locale (UK format)', () => {
    const date = new Date('2023-12-25T10:30:00Z');
    const result = formatDateToDayMonthYear(date, 'Europe/Berlin', 'en-GB');

    expect(result).toBe('25/12/2023');
  });

  it('should format date with French locale', () => {
    const date = new Date('2023-12-25T10:30:00Z');
    const result = formatDateToDayMonthYear(date, 'Europe/Paris', 'fr-FR');

    expect(result).toBe('25/12/2023');
  });

  it('should handle leap year date', () => {
    const date = new Date('2024-02-29T12:00:00Z');
    const result = formatDateToDayMonthYear(date);

    expect(result).toBe('29.02.2024');
  });

  it('should handle first day of year', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    const result = formatDateToDayMonthYear(date);

    expect(result).toBe('01.01.2023');
  });

  it('should handle last day of year', () => {
    const date = new Date('2023-12-31T12:00:00Z');
    const result = formatDateToDayMonthYear(date);

    expect(result).toBe('31.12.2023');
  });

  it('should handle very old date', () => {
    const date = new Date('1900-01-01T00:00:00Z');
    const result = formatDateToDayMonthYear(date);

    expect(result).toBe('01.01.1900');
  });

  it('should handle future date', () => {
    const date = new Date('2030-12-15T15:45:00Z');
    const result = formatDateToDayMonthYear(date);

    expect(result).toBe('15.12.2030');
  });

  it('should format with both custom timezone and locale', () => {
    const date = new Date('2023-12-25T10:30:00Z');
    const result = formatDateToDayMonthYear(date, 'America/New_York', 'en-US');

    expect(result).toBe('12/25/2023');
  });

  it('should handle ISO date string format', () => {
    const result = formatDateToDayMonthYear('2023-08-15');

    expect(result).toBe('15.08.2023');
  });

  it('should handle date string without time', () => {
    const result = formatDateToDayMonthYear('2023-03-20');

    expect(result).toBe('20.03.2023');
  });

  it('should pad single digit days and months correctly', () => {
    const date = new Date('2023-03-05T12:00:00Z');
    const result = formatDateToDayMonthYear(date);

    expect(result).toBe('05.03.2023');
  });

  it('should handle timezone edge case around midnight', () => {
    const date = new Date('2023-07-15T00:30:00Z');
    const result = formatDateToDayMonthYear(date, 'Pacific/Honolulu');

    // Hawaii is UTC-10, so 00:30 UTC becomes 14:30 previous day
    expect(result).toBe('14.07.2023');
  });

  it('should maintain consistency with repeated calls', () => {
    const date = new Date('2023-09-10T16:45:00Z');
    const result1 = formatDateToDayMonthYear(date, 'Europe/Berlin', 'de-DE');
    const result2 = formatDateToDayMonthYear(date, 'Europe/Berlin', 'de-DE');

    expect(result1).toBe(result2);
    expect(result1).toBe('10.09.2023');
  });
});
