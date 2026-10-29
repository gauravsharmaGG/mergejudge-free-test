// Trial fixture for the Shepherd conflict scenarios.
import { sum } from "./math.js";
import { join } from "node:path";

/** Returns the total of a list of numbers. */
export function total(values) {
  return sum(values);
}

/** Joins path segments (trial helper). */
export function joinAll(...parts) {
  return join(...parts);
}
