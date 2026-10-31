import { test } from "node:test";
import assert from "node:assert/strict";
import { percentOff, fixedOff, buyXGetY, bestDiscount } from "../src/pricing/discounts.js";

test("percent and fixed discounts never exceed the subtotal", () => {
  assert.equal(percentOff(1000, 10), 100);
  assert.equal(fixedOff(500, 900), 500);
  assert.throws(() => percentOff(1000, 120), RangeError);
});

test("buy 2 get 1 makes the cheapest unit free", () => {
  const lines = [{ sku: "A", qty: 3, unitMinor: 300 }];
  assert.equal(buyXGetY(lines, "A", 2, 1), 300);
});

test("best discount wins", () => {
  const r = bestDiscount(1000, [{ off: 100, rule: "p" }, { off: 250, rule: "f" }]);
  assert.equal(r.rule, "f");
});
