import { test } from "node:test";
import assert from "node:assert/strict";
import { checkoutTotal, discountFor } from "../src/cart.js";

test("checkout applies a known code", () => {
  assert.equal(checkoutTotal("tea:4\ncake:6\n", "save10"), 9);
  assert.equal(discountFor("nope"), 0);
});
