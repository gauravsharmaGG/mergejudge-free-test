import { test } from "node:test";
import assert from "node:assert/strict";
import { toMinor, fromMinor, addMinor, applyRate, allocate } from "../src/util/money.js";

test("minor unit round trip", () => {
  assert.equal(toMinor(12.34), 1234);
  assert.equal(fromMinor(1234), 12.34);
  assert.equal(toMinor(5, 0), 5);
});

test("addMinor rejects floats", () => {
  assert.equal(addMinor(1, 2, 3), 6);
  assert.throws(() => addMinor(1, 0.5), TypeError);
});

test("applyRate rounds half away from zero", () => {
  assert.equal(applyRate(1050, 0.1), 105);
  assert.equal(applyRate(5, 0.5), 3);
});

test("allocate keeps the total", () => {
  assert.deepEqual(allocate(100, 3), [34, 33, 33]);
  assert.equal(allocate(7, 4).reduce((a, b) => a + b, 0), 7);
});
