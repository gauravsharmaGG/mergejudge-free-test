// Trial fixture for the Shepherd conflict scenarios.
import { sum } from "./math.js";

/** Returns the total of a list of numbers, minus a discount in percent (0 to 100). */
export function total(values, discountPercent = 0) {
  if (!Array.isArray(values)) throw new TypeError("values must be an array");
  if (discountPercent < 0 || discountPercent > 100) throw new RangeError("discount must be between 0 and 100");
  const gross = sum(values);
  return gross - (gross * discountPercent) / 100;
}
