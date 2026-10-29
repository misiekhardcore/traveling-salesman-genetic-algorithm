/**
 * The number inputs carry min/max attributes, but typing is not constrained by
 * them, so out-of-range and half-typed values do reach the handlers. Clamping
 * here keeps a zero-sized population (which has no best route to draw) and a NaN
 * mutation rate (which would silently disable mutation) out of the algorithm.
 */
export function clampNumber(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, value));
}
