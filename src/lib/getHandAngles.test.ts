import { describe, expect, it } from 'vitest';
import { getHandAngles } from './getHandAngles';

function localDate(hours: number, minutes: number, seconds: number) {
  return new Date(2024, 0, 1, hours, minutes, seconds);
}

describe('getHandAngles', () => {
  it('places all hands at 12 at midnight', () => {
    expect(getHandAngles(localDate(0, 0, 0))).toEqual({
      hour: 0,
      minute: 0,
      second: 0,
    });
  });

  it('wraps noon to the top of the clock face', () => {
    expect(getHandAngles(localDate(12, 0, 0))).toEqual({
      hour: 0,
      minute: 0,
      second: 0,
    });
  });

  it('calculates quarter-past positions', () => {
    expect(getHandAngles(localDate(12, 15, 0))).toEqual({
      hour: 7.5,
      minute: 90,
      second: 0,
    });
  });

  it('calculates half-past positions', () => {
    expect(getHandAngles(localDate(6, 30, 0))).toEqual({
      hour: 195,
      minute: 180,
      second: 0,
    });
  });

  it('moves the hour hand smoothly with minutes', () => {
    expect(getHandAngles(localDate(9, 15, 0)).hour).toBe(277.5);
    expect(getHandAngles(localDate(9, 45, 0)).hour).toBe(292.5);
  });

  it('moves the minute hand smoothly with seconds', () => {
    expect(getHandAngles(localDate(6, 10, 30)).minute).toBe(63);
  });

  it('interpolates both hour and minute hands between ticks', () => {
    const angles = getHandAngles(localDate(3, 30, 15));

    expect(angles.hour).toBe(105);
    expect(angles.minute).toBe(181.5);
    expect(angles.second).toBe(90);
  });

  it('handles the last second before 1 PM', () => {
    const angles = getHandAngles(localDate(12, 59, 59));

    expect(angles.hour).toBeCloseTo(29.5);
    expect(angles.minute).toBeCloseTo(359.9);
    expect(angles.second).toBe(354);
  });

  it('keeps late-night angles below a full rotation', () => {
    const angles = getHandAngles(localDate(23, 59, 59));

    expect(angles.hour).toBeCloseTo(359.5);
    expect(angles.minute).toBeCloseTo(359.9);
    expect(angles.second).toBe(354);
  });
});
