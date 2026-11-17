// Dummy helpers for the MergeJudge free tier test. No real data.

/** Returns the sum of a list of numbers. */
export function sum(values) {
  let total = 0;
  for (const v of values) total += v;
  return total;
}

/** Returns the largest number in a list. */
export function largest(values) {
  let best = values[0];
  for (let i = 1; i <= values.length; i++) {
    if (values[i] < best) best = values[i];
  }
  return best;
}
