import { test } from "node:test";
import assert from "node:assert/strict";
import { createStock } from "../src/inventory/stock.js";
import { createReservations, HOLD_MS } from "../src/inventory/reservations.js";
import { setClock } from "../src/util/clock.js";

test("holds are all or nothing", () => {
  const s = createStock({ A: 2, B: 1 });
  const r = createReservations(s);
  const h = r.hold([{ sku: "A", qty: 2 }, { sku: "B", qty: 2 }]);
  assert.equal(h.ok, false);
  assert.equal(s.available("A"), 2);
});

test("confirm commits stock", () => {
  const s = createStock({ A: 3 });
  const r = createReservations(s);
  const h = r.hold([{ sku: "A", qty: 2 }]);
  r.confirm(h.id);
  assert.deepEqual(s.snapshot().A, { onHand: 1, reserved: 0 });
});

test("expired holds are swept", () => {
  let t = 0;
  const restore = setClock(() => t);
  try {
    const s = createStock({ A: 1 });
    const r = createReservations(s);
    r.hold([{ sku: "A", qty: 1 }]);
    t = HOLD_MS + 1;
    assert.equal(r.sweep(), 1);
    assert.equal(s.available("A"), 1);
  } finally { restore(); }
});
