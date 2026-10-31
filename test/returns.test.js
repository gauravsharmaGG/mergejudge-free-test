import { test } from "node:test";
import assert from "node:assert/strict";
import { quoteReturn, restock, ReturnError, RETURN_WINDOW_MS } from "../src/orders/returns.js";
import { createStock } from "../src/inventory/stock.js";
import { setClock } from "../src/util/clock.js";

const order = (deliveredAt) => ({
  status: "delivered",
  history: [{ from: "shipped", to: "delivered", at: deliveredAt }],
  lines: [{ sku: "A", qty: 2, unitMinor: 1500 }, { sku: "GIFTCARD", qty: 1, unitMinor: 5000 }],
});

test("refund is unit price times quantity", () => {
  const restore = setClock(() => 1000);
  try { assert.equal(quoteReturn(order(0), [{ sku: "A", qty: 2 }]), 3000); } finally { restore(); }
});

test("window, quantity and non-returnable checks", () => {
  const restore = setClock(() => RETURN_WINDOW_MS + 10);
  try {
    assert.throws(() => quoteReturn(order(0), [{ sku: "A", qty: 1 }]), (e) => e instanceof ReturnError && e.reason === "window closed");
  } finally { restore(); }
  const r2 = setClock(() => 10);
  try {
    assert.throws(() => quoteReturn(order(0), [{ sku: "A", qty: 3 }]), /bad quantity/);
    assert.throws(() => quoteReturn(order(0), [{ sku: "GIFTCARD", qty: 1 }]), /not returnable/);
  } finally { r2(); }
});

test("restock puts units back", () => {
  const s = createStock({ A: 0 });
  restock(s, [{ sku: "A", qty: 2 }]);
  assert.equal(s.available("A"), 2);
});
