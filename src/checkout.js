// Checkout orchestration: validate cart -> reserve stock -> price (coupon, shipping, tax) -> charge -> confirm -> notify.
// On a failed charge the stock hold is cancelled so items go back on sale immediately.
import { computeTotals } from "./cart/totals.js";
import { shippingMinor } from "./shipping/rates.js";
import { pickCarrier } from "./shipping/carriers.js";
import { estimateDelivery } from "./shipping/estimate.js";
import { createReservations } from "./inventory/reservations.js";
import { CouponError } from "./pricing/coupons.js";
import { formatMoney } from "./format.js";
import { requireCountry, requireEmail, ValidationError } from "./util/validate.js";
import { createLogger } from "./util/logger.js";
import { isEnabled } from "./flags.js";

export function createCheckout({ stock, coupons, gateway, notifier, logger = createLogger({ level: "warn" }) }) {
  const reservations = createReservations(stock);
  let orderSeq = 1000;

  async function placeOrder({ cart, email, name, country, paymentToken, weightGrams = 1000 }) {
    if (cart.isEmpty()) throw new ValidationError("cart", "is empty");
    const to = requireEmail(email);
    const dest = requireCountry(country);
    const lines = cart.lines;
    const orderId = `ORD-${++orderSeq}`;

    const hold = reservations.hold(lines);
    if (!hold.ok) return { ok: false, orderId, error: "out_of_stock", sku: hold.sku };

    try {
      let discountMinor = 0;
      if (cart.coupon) {
        try {
          discountMinor = coupons.quote(cart.coupon, cart.customerId, cart.subtotalMinor);
        } catch (e) {
          if (!(e instanceof CouponError)) throw e;
          reservations.cancel(hold.id);
          return { ok: false, orderId, error: "coupon_" + e.reason.replace(/ /g, "_") };
        }
      }
      const base = shippingMinor({ country: dest, weightGrams, subtotalMinor: cart.subtotalMinor - discountMinor });
      const carrier = base === 0 ? { id: "dhl", priceMinor: 0 } : pickCarrier(dest, weightGrams, base);
      const totals = computeTotals({ lines, discountMinor, shippingMinor: carrier.priceMinor, country: dest });

      const charge = await gateway.charge({ orderId, amountMinor: totals.total, currency: cart.currency, paymentToken });
      reservations.confirm(hold.id);
      if (cart.coupon) coupons.redeem(cart.coupon, cart.customerId, cart.subtotalMinor);

      const eta = estimateDelivery(dest);
      if (isEnabled("orderEmails")) {
        notifier.enqueue("orderConfirmed", to, { name, orderId, total: formatMoney(totals.total, cart.currency), ...eta });
      }
      logger.info("order placed", { orderId, total: totals.total, carrier: carrier.id });
      return { ok: true, orderId, chargeId: charge.chargeId, totals, carrier: carrier.id, eta };
    } catch (e) {
      reservations.cancel(hold.id);
      logger.error("checkout failed", { orderId, error: e.code ?? e.message });
      return { ok: false, orderId, error: e.code ?? "checkout_failed" };
    }
  }

  return { placeOrder, sweepHolds: () => reservations.sweep() };
}
