// Coupon codes: validation, expiry, per-customer limits. Codes are case-insensitive.
import { isPast } from "../util/clock.js";
import { percentOff, fixedOff } from "./discounts.js";

export class CouponError extends Error {
  constructor(code, reason) { super(`coupon ${code}: ${reason}`); this.name = "CouponError"; this.reason = reason; }
}

export function createCouponBook(defs = []) {
  const coupons = new Map();
  const redemptions = new Map(); // code -> Map(customerId -> count)
  for (const d of defs) coupons.set(d.code.toUpperCase(), { maxPerCustomer: 1, minSubtotalMinor: 0, ...d, code: d.code.toUpperCase() });

  function check(code, customerId, subtotalMinor) {
    const c = coupons.get(String(code).toUpperCase());
    if (!c) throw new CouponError(code, "unknown");
    if (c.expires && isPast(c.expires)) throw new CouponError(code, "expired");
    if (subtotalMinor < c.minSubtotalMinor) throw new CouponError(code, "minimum not reached");
    const used = redemptions.get(c.code)?.get(customerId) ?? 0;
    if (used >= c.maxPerCustomer) throw new CouponError(code, "already used");
    return c;
  }

  return {
    /** Discount in minor units this coupon gives on the subtotal, or throws CouponError. */
    quote(code, customerId, subtotalMinor) {
      const c = check(code, customerId, subtotalMinor);
      return c.kind === "percent" ? percentOff(subtotalMinor, c.value) : fixedOff(subtotalMinor, c.value);
    },
    redeem(code, customerId, subtotalMinor) {
      const c = check(code, customerId, subtotalMinor);
      const per = redemptions.get(c.code) ?? new Map();
      per.set(customerId, (per.get(customerId) ?? 0) + 1);
      redemptions.set(c.code, per);
      return c.code;
    },
  };
}
