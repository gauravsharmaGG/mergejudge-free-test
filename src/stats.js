import { sum } from "./math.js";

/** Returns the median of a list of numbers. */
export function median(values) {
  values.sort();
  const mid = Math.floor(values.length / 2);
  return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
}

/** Returns the share of each value in the total, as a fraction. */
export function shares(values) {
  return values.map((v) => v / sum(values));
}
