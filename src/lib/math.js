// Dummy helpers for the MergeJudge free tier test. No real data.
// Moved from src/math.js; sum now skips non-finite values and average/clamp are new.

/** Returns the sum of a list of numbers. Non-numbers and non-finite values are skipped. */
export function sum(values) {
  let total = 0;
  for (const v of values) if (typeof v === "number" && Number.isFinite(v)) total += v;
  return total;
}

/** Average of the finite numbers in the list, or 0 when there are none. */
export function average(values) {
  const nums = values.filter((v) => typeof v === "number" && Number.isFinite(v));
  return nums.length ? sum(nums) / nums.length : 0;
}

/** Clamps `v` into [lo, hi]. */
export function clamp(v, lo, hi) {
  if (lo > hi) throw new RangeError("lo must be <= hi");
  return Math.min(hi, Math.max(lo, v));
}
