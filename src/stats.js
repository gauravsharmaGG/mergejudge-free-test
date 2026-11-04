// Small stats helpers for the MergeJudge free tier test. No real data.
import { sum } from "./math.js";

/** Returns the arithmetic mean of a list of numbers, or 0 for an empty list. */
export function average(values) {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
}

/** Drops missing entries (null or undefined) but keeps 0 and "". */
export function compact(values) {
  return values.filter((v) => v != null);
}

/** Formats a finite numeric amount for the demo report; otherwise throws TypeError. */
export function formatAmount(amount) {
  if (!Number.isFinite(amount)) {
    throw new TypeError("amount must be a finite number");
  }
  return amount.toFixed(2) + " EUR";
}
