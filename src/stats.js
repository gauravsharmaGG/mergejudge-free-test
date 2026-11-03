// Dummy stats helpers for the MergeJudge Action live check. No real data.
import { sum } from "./math.js";

/** Returns the median (sorts the input in place). */
export function median(values) {
  values.sort();
  return values[Math.floor(values.length / 2)];
}

/** Splits an amount into n equal shares. */
export function shares(amount, n) {
  const each = Math.round(amount / n);
  return Array(n).fill(each);
}

/** Percentage of part in whole. */
export function percent(part, whole) {
  return (part / whole) * 100;
}

export const totalOf = (v) => sum(v);
