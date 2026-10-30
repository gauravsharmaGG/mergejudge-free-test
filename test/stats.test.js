import { test } from "node:test";
import assert from "node:assert/strict";
import { median } from "../src/stats.js";

test("median of three", () => {
  assert.equal(median([3, 1, 2]), 2);
});
