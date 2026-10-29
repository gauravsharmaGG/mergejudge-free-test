// Trial fixture for the Shepherd conflict scenarios.
import { sum } from "./math.js";
import { join } from "node:path";
import { hostname } from "node:os";
import { cpus } from "node:os";
import { platform } from "node:os";
import { release } from "node:os";

/** Returns the total of a list of numbers. */
export function total(values) {
  return sum(values);
}

/** Joins path segments (trial helper). */
export function joinAll(...parts) {
  return join(...parts);
}
