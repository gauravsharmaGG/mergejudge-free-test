import { test } from "node:test";
import assert from "node:assert/strict";
import { computeTotals } from "../src/cart/totals.js";

test("tax applies after discount, per class", () => {
  const lines = [
    { sku: "BOOK", qty: 1, unitMinor: 10000, taxClass: "reduced" },
    { sku: "PEN", qty: 1, unitMinor: 10000, taxClass: "standard" },
  ];
  const t = computeTotals({ lines, discountMinor: 2000, shippingMinor: 0, country: "DE" });
  assert.equal(t.subtotal, 20000);
  assert.equal(t.discount, 2000);
  assert.equal(t.tax, 630 + 1710);
  assert.equal(t.total, 18000 + 2340);
});

test("shipping is taxed at the standard rate", () => {
  const t = computeTotals({ lines: [{ sku: "A", qty: 1, unitMinor: 1000, taxClass: "standard" }], shippingMinor: 490, country: "DE" });
  assert.equal(t.tax, 190 + 93);
});
