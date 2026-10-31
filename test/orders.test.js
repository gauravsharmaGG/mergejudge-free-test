import { test } from "node:test";
import assert from "node:assert/strict";
import { createOrderStore } from "../src/orders/store.js";
import { canTransition, isFinal, TransitionError } from "../src/orders/status.js";
import { dailyReport, reportCsv } from "../src/orders/report.js";

const base = (id, total = 1000, lines = [{ sku: "A", qty: 1, unitMinor: total }]) => ({ orderId: id, customerId: "c1", email: "a@b.de", totals: { total }, currency: "EUR", lines });

test("status machine", () => {
  assert.equal(canTransition("placed", "paid"), true);
  assert.equal(canTransition("placed", "shipped"), false);
  assert.equal(isFinal("refunded"), true);
});

test("store moves orders and records history", () => {
  const s = createOrderStore();
  s.create(base("O1"));
  s.move("O1", "paid");
  const o = s.move("O1", "packed", "warehouse 2");
  assert.equal(o.history.length, 2);
  assert.equal(o.history[1].note, "warehouse 2");
  assert.throws(() => s.move("O1", "delivered"), TransitionError);
  assert.throws(() => s.create(base("O1")), RangeError);
});

test("revenue ignores unpaid, cancelled and refunded orders", () => {
  const s = createOrderStore();
  s.create(base("O1", 1000)); s.move("O1", "paid");
  s.create(base("O2", 2000));
  s.create(base("O3", 3000)); s.move("O3", "paid"); s.move("O3", "refunded");
  assert.equal(s.revenueMinor(), 1000);
  assert.equal(s.byStatus("placed").length, 1);
});

test("daily report", () => {
  const s = createOrderStore();
  s.create(base("O1", 1000, [{ sku: "A", qty: 2, unitMinor: 500 }])); s.move("O1", "paid");
  s.create(base("O2", 3000, [{ sku: "B", qty: 1, unitMinor: 3000 }])); s.move("O2", "paid");
  const r = dailyReport([s.get("O1"), s.get("O2")]);
  assert.equal(r.orders, 2);
  assert.equal(r.averageMinor, 2000);
  assert.deepEqual(r.topSkus[0], { sku: "A", qty: 2 });
  assert.match(reportCsv(r), /^orders,/);
});
