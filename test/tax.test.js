import { test } from "node:test";
import assert from "node:assert/strict";
import { rateFor, taxMinor, splitGross } from "../src/pricing/tax.js";

test("German VAT", () => {
  assert.equal(rateFor("DE"), 0.19);
  assert.equal(rateFor("DE", "reduced"), 0.07);
  assert.equal(taxMinor(10000, "DE"), 1900);
});

test("unknown country pays no tax", () => {
  assert.equal(rateFor("ZZ"), 0);
});

test("splitGross", () => {
  assert.deepEqual(splitGross(11900, "DE"), { net: 10000, tax: 1900 });
});
