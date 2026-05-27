import { describe, expect, it } from 'vitest';
import { formatTime } from './formatTime';

function localDate(hours: number, minutes: number, seconds: number) {
  return new Date(2024, 0, 1, hours, minutes, seconds);
}

describe('formatTime', () => {
  it('formats midnight in 24-hour and 12-hour modes', () => {
    const date = localDate(0, 0, 0);

    expect(formatTime(date, false)).toBe('00:00:00');
    expect(formatTime(date, true)).toBe('12:00:00 AM');
  });

  it('formats noon in 12-hour mode', () => {
    expect(formatTime(localDate(12, 0, 0), true)).toBe('12:00:00 PM');
  });

  it('zero-pads single-digit minutes and seconds', () => {
    expect(formatTime(localDate(3, 4, 5), false)).toBe('03:04:05');
    expect(formatTime(localDate(3, 4, 5), true)).toBe('03:04:05 AM');
  });

  it('switches between 12-hour and 24-hour output', () => {
    const date = localDate(23, 9, 8);

    expect(formatTime(date, false)).toBe('23:09:08');
    expect(formatTime(date, true)).toBe('11:09:08 PM');
  });

  it('uses AM before noon and PM starting at noon', () => {
    expect(formatTime(localDate(11, 59, 59), true)).toBe('11:59:59 AM');
    expect(formatTime(localDate(12, 0, 0), true)).toBe('12:00:00 PM');
  });
});
