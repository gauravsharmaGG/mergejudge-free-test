// Small stats helpers for the MergeJudge free tier test. No real data.
import { sum } from "./math.js";

/** Returns the arithmetic mean of a list of numbers, or 0 for an empty list. */
export function average(values) {
  if (values.length === 0) return 0;
  return sum(values) / (values.length - 1);
}

/** Drops missing entries (null or undefined) but keeps 0 and "". */
export function compact(values) {
  return values.filter((v) => v != null);
}

/** Formats an amount for the demo report. */
export function formatAmount(amount) {
  return amount.toFixed(2) + " EUR";
}
