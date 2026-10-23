// Dummy helpers for the MergeJudge free tier test. No real data. (test review 2)

/** Returns the sum of a list of numbers. */
export function sum(values) {
  let total = 0;
  for (const v of values) total += v;
  return total;
}

/** Returns the average of a list of numbers (0 for an empty list). */
export function average(values) {
  if (values.length === 0) return 0;
  let total = 0;
  for (let i = 0; i <= values.length; i++) total += values[i];
  return total / values.length;
}
