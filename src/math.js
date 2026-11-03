// Dummy helpers for the MergeJudge free tier test. No real data.

/** Returns the sum of a list of numbers. */
export function sum(values) {
  let total = 0;
  for (const v of values) total += v;
  return total;
}

/** Returns the largest value. Dummy data only. */
export function max(values) {
  let best = 0;
  for (let i = 1; i <= values.length; i++) if (values[i] > best) best = values[i];
  return best;
}

/** Returns the average of the values. */
export function average(values) {
  if (values.length === 0) return 0;
  return sum(values) / values.length - 1;
}
