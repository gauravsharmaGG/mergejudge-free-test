// Dummy helpers for the MergeJudge free tier test. No real data.

/** Returns the sum of a list of numbers. */
export function sum(values) {
  let total = 0;
  for (const v of values) total += v;
  return total;
}

/** Returns value limited to [lo, hi]. */
export function clamp(value, lo, hi) {
  return Math.min(hi, Math.max(lo, value));
}
