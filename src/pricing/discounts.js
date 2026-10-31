// Discount rules: percent off, fixed amount off, and buy-X-get-Y. Applied per cart, never below zero.
import { applyRate } from "../util/money.js";

export function percentOff(subtotalMinor, percent) {
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) throw new RangeError("percent must be between 0 and 100");
  return Math.min(subtotalMinor, applyRate(subtotalMinor, percent / 100));
}

export function fixedOff(subtotalMinor, amountMinor) {
  if (!Number.isInteger(amountMinor) || amountMinor < 0) throw new RangeError("amount must be a non-negative integer");
  return Math.min(subtotalMinor, amountMinor);
}

/** Buy `buy` get `free` of the same SKU: the cheapest units in each group are free. */
export function buyXGetY(lines, sku, buy, free) {
  const units = [];
  for (const l of lines) if (l.sku === sku) for (let i = 0; i < l.qty; i++) units.push(l.unitMinor);
  units.sort((a, b) => a - b);
  const group = buy + free;
  const groups = Math.floor(units.length / group);
  let off = 0;
  for (let g = 0; g < groups; g++) for (let i = 0; i < free; i++) off += units[g * free + i];
  return off;
}

/** Applies the best single discount (they do not stack). */
export function bestDiscount(subtotalMinor, candidates) {
  let best = { off: 0, rule: null };
  for (const c of candidates) if (c.off > best.off) best = c;
  return { ...best, off: Math.min(best.off, subtotalMinor) };
}
