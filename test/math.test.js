import { test } from "node:test";
import assert from "node:assert/strict";
import { average, sum } from "../src/math.js";

test("sum adds numbers", () => {
  assert.equal(sum([1, 2, 3]), 6);
  assert.equal(sum([]), 0);
});

test("average divides the sum by the count", () => {
  assert.equal(average([2, 4, 6]), 4);
  assert.equal(average([]), 0);
});
