import { test } from "node:test";
import assert from "node:assert/strict";
import { createCart } from "../src/cart/cart.js";
import { MAX_QTY } from "../src/cart/line-items.js";

test("same SKU lines merge", () => {
  const c = createCart().add({ sku: "A", qty: 2, unitMinor: 100 }).add({ sku: "A", qty: 3, unitMinor: 100 });
  assert.equal(c.lines.length, 1);
  assert.equal(c.itemCount, 5);
  assert.equal(c.subtotalMinor, 500);
});

test("quantity is capped", () => {
  const c = createCart().add({ sku: "A", qty: 90, unitMinor: 1 }).add({ sku: "A", qty: 90, unitMinor: 1 });
  assert.equal(c.itemCount, MAX_QTY);
});

test("setQty 0 removes the line", () => {
  const c = createCart().add({ sku: "A", qty: 1, unitMinor: 1 });
  c.setQty("A", 0);
  assert.ok(c.isEmpty());
});
