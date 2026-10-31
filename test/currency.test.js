import { test } from "node:test";
import assert from "node:assert/strict";
import { convertMinor, decimalsFor } from "../src/pricing/currency.js";

test("EUR to JPY uses zero decimals", () => {
  assert.equal(decimalsFor("JPY"), 0);
  assert.equal(convertMinor(1000, "EUR", "JPY"), 1624);
});

test("same currency is identity", () => {
  assert.equal(convertMinor(1234, "USD", "USD"), 1234);
  assert.throws(() => decimalsFor("XXX"), RangeError);
});
