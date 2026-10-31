// Public entry point. `total` is kept for existing callers; the checkout API is new.
import { sum } from "./lib/math.js";

export { createCheckout } from "./checkout.js";
export { createCart } from "./cart/cart.js";
export { createStock } from "./inventory/stock.js";
export { createCouponBook } from "./pricing/coupons.js";
export { formatMoney } from "./format.js";
export { createOrderStore } from "./orders/store.js";
export { quoteReturn } from "./orders/returns.js";
export { dailyReport } from "./orders/report.js";

/** Returns the total of a list of numbers. Deprecated: use cart totals for money. */
export function total(values) {
  return sum(values);
}
