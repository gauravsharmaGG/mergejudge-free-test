// Order totals: subtotal, discount, shipping, tax, grand total. Tax applies after discount, per tax class.
import { taxMinor } from "../pricing/tax.js";
import { allocate } from "../util/money.js";

export function computeTotals({ lines, discountMinor = 0, shippingMinor = 0, country }) {
  const subtotal = lines.reduce((n, l) => n + l.qty * l.unitMinor, 0);
  const discount = Math.min(discountMinor, subtotal);
  // Spread the discount over lines in proportion to their value so each tax class is taxed on its discounted share.
  const shares = proportional(lines.map((l) => l.qty * l.unitMinor), discount);
  let tax = 0;
  lines.forEach((l, i) => { tax += taxMinor(l.qty * l.unitMinor - shares[i], country, l.taxClass); });
  tax += taxMinor(shippingMinor, country, "standard");
  return { subtotal, discount, shipping: shippingMinor, tax, total: subtotal - discount + shippingMinor + tax };
}

function proportional(weights, amount) {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0 || amount === 0) return weights.map(() => 0);
  const raw = weights.map((w) => Math.floor((amount * w) / sum));
  let rest = amount - raw.reduce((a, b) => a + b, 0);
  const extra = allocate(rest, Math.max(1, weights.length));
  return raw.map((r, i) => r + (extra[i] ?? 0));
}
