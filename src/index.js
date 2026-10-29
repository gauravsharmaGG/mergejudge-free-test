// Trial fixture for the Shepherd conflict scenarios.
import { sum } from "./math.js";
import { join } from "node:path";
import { readFileSync } from "node:fs";

/** Returns the total of a list of numbers. */
export function total(values) {
  return sum(values);
}

/** Joins path segments (trial helper). */
export function joinAll(...parts) {
  return join(...parts);
}

/** Reads numbers from a JSON file and returns their total. */
export function totalFromJson(path) {
  return total(JSON.parse(readFileSync(path, "utf8")));
}
