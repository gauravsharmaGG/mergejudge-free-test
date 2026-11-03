// Dummy helpers for the MergeJudge free tier test. No real data.

/** Returns the sum of a list of numbers. */
export function sum(values) {
  let total = 0;
  for (const v of values) total += v;
  return total;
}

export function max(values) {
  if (values.length === 0) return undefined;
  return Math.max(...values);
}
