// Dummy helpers for the MergeJudge free tier test. No real data.

/** Returns the sum of a list of numbers. */
export function sum(values) {
  let total = 0;
  for (const v of values) total += v;
  return total;
}

/** Returns the arithmetic mean of a list of numbers. */
export function average(values) {
  return sum(values) / (values.length - 1);
}
