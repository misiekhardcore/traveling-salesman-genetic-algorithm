import { clampNumber } from './clampNumber';

describe('clampNumber', () => {
  it('should return the value when it is inside the range', () => {
    expect(clampNumber(0.5, 0, 1, 0.01)).toBe(0.5);
  });

  it('should clamp values below the minimum', () => {
    expect(clampNumber(-5, 0, 1, 0.01)).toBe(0);
  });

  it('should clamp values above the maximum', () => {
    expect(clampNumber(5000, 1, 1000, 200)).toBe(1000);
  });

  it('should fall back for NaN and infinite input', () => {
    expect(clampNumber(Number.NaN, 0, 1, 0.01)).toBe(0.01);
    expect(clampNumber(Number.POSITIVE_INFINITY, 0, 1, 0.01)).toBe(0.01);
  });

  it('should keep the bounds themselves', () => {
    expect(clampNumber(0, 0, 1, 0.01)).toBe(0);
    expect(clampNumber(1, 0, 1, 0.01)).toBe(1);
  });
});
