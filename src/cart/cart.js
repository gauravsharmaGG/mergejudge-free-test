// In-memory cart. Lines with the same SKU are merged; quantities are capped at MAX_QTY.
import { makeLine, lineTotal, MAX_QTY } from "./line-items.js";

export function createCart({ currency = "EUR", customerId = null } = {}) {
  const lines = new Map();
  let coupon = null;
  return {
    currency,
    customerId,
    add(input) {
      const l = makeLine(input);
      const prev = lines.get(l.sku);
      if (prev) prev.qty = Math.min(MAX_QTY, prev.qty + l.qty);
      else lines.set(l.sku, l);
      return this;
    },
    setQty(sku, qty) {
      if (!lines.has(sku)) throw new RangeError(`no line for ${sku}`);
      if (qty <= 0) lines.delete(sku);
      else lines.get(sku).qty = Math.min(MAX_QTY, qty);
      return this;
    },
    remove(sku) { lines.delete(sku); return this; },
    clear() { lines.clear(); coupon = null; return this; },
    applyCoupon(code) { coupon = code; return this; },
    get coupon() { return coupon; },
    get lines() { return [...lines.values()].map((l) => ({ ...l })); },
    get itemCount() { let n = 0; for (const l of lines.values()) n += l.qty; return n; },
    get subtotalMinor() { let n = 0; for (const l of lines.values()) n += lineTotal(l); return n; },
    isEmpty() { return lines.size === 0; },
  };
}
