// Trial fixture for the Shepherd conflict scenarios.
import { sum } from "./math.js";
import { readFileSync } from "node:fs";

/** Returns the total of a list of numbers. */
export function total(values) {
  return sum(values);
}

/** Reads a list of numbers from a JSON file and returns their total. */
export function totalFromFile(path) {
  return total(JSON.parse(readFileSync(path, "utf8")));
}
