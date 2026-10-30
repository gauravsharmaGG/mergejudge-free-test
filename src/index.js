// Trial fixture for the Shepherd conflict scenarios.
import { sum } from "./math.js";

/** Returns the total of a list of numbers. Throws on a missing list instead of returning 0. */
export function total(values) {
  if (!Array.isArray(values)) throw new TypeError("total() needs an array");
  return sum(values);
}
