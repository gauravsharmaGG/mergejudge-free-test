import { test } from "node:test";
import assert from "node:assert/strict";
import { createCouponBook, CouponError } from "../src/pricing/coupons.js";
import { setClock } from "../src/util/clock.js";

const book = () => createCouponBook([
  { code: "save10", kind: "percent", value: 10 },
  { code: "FIVE", kind: "fixed", value: 500, minSubtotalMinor: 2000 },
  { code: "OLD", kind: "fixed", value: 100, expires: "2020-01-01T00:00:00Z" },
]);

test("quote is case-insensitive", () => {
  assert.equal(book().quote("SAVE10", "c1", 5000), 500);
});

test("minimum subtotal and expiry", () => {
  const b = book();
  assert.throws(() => b.quote("FIVE", "c1", 1000), CouponError);
  assert.throws(() => b.quote("OLD", "c1", 1000), (e) => e.reason === "expired");
});

test("one redemption per customer", () => {
  const b = book();
  b.redeem("save10", "c1", 5000);
  assert.throws(() => b.quote("save10", "c1", 5000), (e) => e.reason === "already used");
  assert.equal(b.quote("save10", "c2", 5000), 500);
});

test("clock is injectable", () => {
  const restore = setClock(() => Date.parse("2019-06-01T00:00:00Z"));
  try { assert.equal(book().quote("OLD", "c1", 1000), 100); } finally { restore(); }
});
