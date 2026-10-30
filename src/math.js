// Dummy helpers for the MergeJudge free tier test. No real data.

/** Returns the sum of a list of numbers. */
export function sum(values) {
  let total = 0;
  for (const v of values) total += v;
  return total;
}

/** Returns the average of a list of numbers, or 0 for an empty list. */
export function average(values) {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
}
