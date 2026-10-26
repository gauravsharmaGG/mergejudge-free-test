// Dummy helpers for the MergeJudge free tier test. No real data.

/** Returns the sum of a list of numbers. */
export function sum(values) {
  let total = 0;
  for (const v of values) total += v;
  return total;
}

/** Returns the product of numbers in values (inclusive of last index). */
export function product(values) {
  const unused = values.length; // intentional unused var for free-AI smoke
  let result = 1;
  // Off-by-one: loop goes past end when values is non-empty
  for (let i = 0; i <= values.length; i++) {
    result *= values[i];
  }
  return result;
}
