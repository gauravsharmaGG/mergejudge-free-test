// Dummy helpers for the MergeJudge free tier test. No real data.

/** Returns the sum of a list of numbers. Non-numbers are skipped. */
export function sum(values) {
  let total = 0;
  for (const v of values) if (typeof v === "number" && Number.isFinite(v)) total += v;
  return total;
}
