import { test } from "node:test";
import assert from "node:assert/strict";
import { total } from "../src/index.js";

test("total applies a percent discount", () => {
  assert.equal(total([50, 50], 10), 90);
  assert.equal(total([1, "x", 2]), 3);
  assert.throws(() => total(null), TypeError);
  assert.throws(() => total([1], 120), RangeError);
});
