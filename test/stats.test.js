import { test } from "node:test";
import assert from "node:assert/strict";
import { average, compact, formatAmount } from "../src/stats.js";

test("average of empty list is 0", () => {
  assert.equal(average([]), 0);
});

test("compact keeps 0 and empty string", () => {
  assert.deepEqual(compact([0, null, "", undefined, 3]), [0, "", 3]);
});

test("formatAmount uses two decimals", () => {
  assert.equal(formatAmount(1.5), "1.50 EUR");
});
