import { test } from "node:test";
import assert from "node:assert/strict";
import { sum, clamp } from "../src/math.js";

test("sum adds numbers", () => {
  assert.equal(sum([1, 2, 3]), 6);
  assert.equal(sum([]), 0);
});

test("clamp limits a value", () => {
  assert.equal(clamp(5, 0, 3), 3);
  assert.equal(clamp(-1, 0, 3), 0);
  assert.equal(clamp(2, 0, 3), 2);
});
