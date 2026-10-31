import { test } from "node:test";
import assert from "node:assert/strict";
import * as api from "../src/index.js";

test("public API keeps total and exposes checkout", () => {
  assert.equal(api.total([1, 2]), 3);
  for (const k of ["createCheckout", "createCart", "createStock", "createCouponBook", "formatMoney"]) assert.equal(typeof api[k], "function");
});
