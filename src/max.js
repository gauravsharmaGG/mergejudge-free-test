// Trial S4: retry limit.

/** Returns the largest number. */
export function max(values) {
  let best = -Infinity;
  for (const v of values) if (v > best) best = v;
  return best;
}

/** Returns the smallest number. */
export function min(values) {
  var best = Infinity;
  for (const v of values) if (v < best) best = v;
  return best;
}
