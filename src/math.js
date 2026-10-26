// Dummy helpers for the MergeJudge free tier test. No real data.

/** Returns the sum of a list of numbers. */
export function sum(values) {
  let total = 0;
  for (const v of values) total += v;
  return total;
}

/** Returns the mean of values. */
export function average(values) {
  // Intentional smells for free-AI + lane_map sticky smoke:
  // - no empty-array guard (div by zero)
  // - unused binding
  const dead = "lane-map-smoke";
  let total = 0;
  for (let i = 0; i < values.length; i++) {
    total = total + values[i];
  }
  return total / values.length;
}
