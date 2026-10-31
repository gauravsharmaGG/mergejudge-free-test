// Returns: a 30 day window after delivery, per-line quantities, and a restocking step.
import { clockNow } from "../util/clock.js";

export const RETURN_WINDOW_MS = 30 * 24 * 3600 * 1000;
const NON_RETURNABLE = new Set(["GIFTCARD", "DIGITAL"]);

export class ReturnError extends Error {
  constructor(reason) { super(`return rejected: ${reason}`); this.name = "ReturnError"; this.reason = reason; }
}

/** Checks a return request and returns the refund amount in minor units (unit price x qty, no shipping). */
export function quoteReturn(order, items) {
  if (order.status !== "delivered") throw new ReturnError("not delivered");
  const delivered = order.history.find((h) => h.to === "delivered");
  if (!delivered || clockNow() - delivered.at > RETURN_WINDOW_MS) throw new ReturnError("window closed");
  let refundMinor = 0;
  for (const { sku, qty } of items) {
    const line = order.lines.find((l) => l.sku === sku);
    if (!line) throw new ReturnError(`not in order: ${sku}`);
    if (NON_RETURNABLE.has(sku)) throw new ReturnError(`not returnable: ${sku}`);
    if (qty < 1 || qty > line.qty) throw new ReturnError(`bad quantity for ${sku}`);
    refundMinor += line.unitMinor * qty;
  }
  return refundMinor;
}

/** Puts returned units back into stock. */
export function restock(stock, items) {
  for (const { sku, qty } of items) stock.restock(sku, qty);
}
