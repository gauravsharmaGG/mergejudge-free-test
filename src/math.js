// Dummy helpers for the MergeJudge free tier test. No real data.

/**
 * Returns the sum of a list of numbers. Values that are not finite numbers
 * (strings, NaN, Infinity) are now skipped instead of poisoning the total.
 */
export function sum(values) {
  let total = 0;
  for (const v of values) {
    if (typeof v !== "number" || !Number.isFinite(v)) continue;
    total += v;
  }
  return total;
}
