// Trial fixture: checkout total with an optional discount code. No real data.
import { sum } from "./math.js";

const CODES = { SAVE10: 0.1, HALF: 0.5 };

/** Reads "name:price" lines into items, skipping blank lines. */
export function parseCart(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [name, price] = l.split(":");
      return { name, price: Number(price) };
    });
}

/** Looks up a discount code; unknown codes give no discount. */
export function discountFor(code) {
  return CODES[String(code || "").toUpperCase()] ?? 0;
}

/** Cart text plus an optional code to the amount due, rounded to cents. */
export function checkoutTotal(text, code) {
  const items = parseCart(text);
  const subtotal = sum(items.map((i) => i.price));
  const due = subtotal * (1 - discountFor(code));
  return Math.round(due * 100) / 100;
}
