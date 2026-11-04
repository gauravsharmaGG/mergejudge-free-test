import { test } from "node:test";
import assert from "node:assert/strict";
import { average, compact, formatAmount } from "../src/stats.js";

test("average of empty list is 0", () => {
  assert.equal(average([]), 0);
});

test("average divides the sum by the number of values", () => {
  assert.equal(average([2, 4, 6]), 4);
});

test("average of a single value is that value", () => {
  assert.equal(average([7]), 7);
});

test("compact keeps 0 and empty string", () => {
  assert.deepEqual(compact([0, null, "", undefined, 3]), [0, "", 3]);
});

test("compact keeps false and NaN while dropping missing entries", () => {
  assert.deepEqual(compact([false, null, NaN, undefined]), [false, NaN]);
});

test("formatAmount uses two decimals", () => {
  assert.equal(formatAmount(1.5), "1.50 EUR");
  assert.equal(formatAmount(0), "0.00 EUR");
  assert.equal(formatAmount(-1.5), "-1.50 EUR");
});

test("formatAmount rejects non-numeric and non-finite amounts", () => {
  for (const amount of [null, undefined, "1.5", true, {}, [], NaN, Infinity, -Infinity]) {
    assert.throws(() => formatAmount(amount), {
      name: "TypeError",
      message: "amount must be a finite number",
    });
  }
});
