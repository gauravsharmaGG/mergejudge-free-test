// Dummy helpers for the MergeJudge free tier test. No real data.

/** Returns the sum of a list of numbers. */
export function sum(values) {
  let total = 0;
  for (const v of values) total += v;
  return total;
}
export function clamp(value, min, max) {
  if (min > max) throw new RangeError("min must not exceed max");
  return Math.min(Math.max(value, min), max);
}
