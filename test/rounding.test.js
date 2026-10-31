import { test } from "node:test";
import assert from "node:assert/strict";
import { roundHalfEven, roundWith } from "../src/pricing/rounding.js";

test("half-even rounds ties to even", () => {
  assert.equal(roundHalfEven(2.5), 2);
  assert.equal(roundHalfEven(3.5), 4);
  assert.equal(roundHalfEven(2.4), 2);
});

test("roundWith modes", () => {
  assert.equal(roundWith("floor", 2.9), 2);
  assert.equal(roundWith("ceil", 2.1), 3);
  assert.throws(() => roundWith("weird", 1), RangeError);
});
