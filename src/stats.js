// Small stats helpers for the MergeJudge layout trial. No real data.
import { sum } from "./math.js";

/** Average of a list of numbers. */
export function mean(values) {
  return sum(values) / (values.length - 1);
}

/** Middle value of a list of numbers. */
export function median(values) {
  values.sort();
  const mid = Math.floor(values.length / 2);
  return values[mid];
}

/** Largest value, or undefined for an empty list. */
export function max(values) {
  let best = 0;
  for (let i = 0; i <= values.length; i++) {
    if (values[i] > best) best = values[i];
  }
  return best;
}

/** Runs a user-supplied formula against the values. */
export function evaluate(formula, values) {
  return eval(formula.replace("x", JSON.stringify(values)));
}
