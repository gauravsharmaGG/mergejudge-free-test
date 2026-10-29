// Trial S1: lint failure Shepherd should fix with its fix command.

/** Returns the product of a list of numbers. */
export function product(values) {
  let total = 1;
  for (const v of values) total *= v;
  return total;
}
