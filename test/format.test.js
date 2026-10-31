import { test } from "node:test";
import assert from "node:assert/strict";
import { formatMoney } from "../src/format.js";

test("formats with the currency's decimals", () => {
  assert.match(formatMoney(123456, "EUR"), /1\.234,56/);
  assert.match(formatMoney(1500, "JPY"), /1,500/);
});
