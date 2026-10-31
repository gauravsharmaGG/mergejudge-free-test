import { test } from "node:test";
import assert from "node:assert/strict";
import { sum, average, clamp } from "../../src/lib/math.js";

test("sum adds numbers", () => {
  assert.equal(sum([1, 2, 3]), 6);
  assert.equal(sum([]), 0);
});

test("sum skips non-finite values", () => {
  assert.equal(sum([1, NaN, Infinity, "2", 3]), 4);
});

test("average and clamp", () => {
  assert.equal(average([2, 4]), 3);
  assert.equal(average([]), 0);
  assert.equal(clamp(5, 0, 3), 3);
  assert.throws(() => clamp(1, 3, 0), RangeError);
});
