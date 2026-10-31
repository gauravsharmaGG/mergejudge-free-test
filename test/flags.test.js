import { test } from "node:test";
import assert from "node:assert/strict";
import { loadFlags, isEnabled } from "../src/flags.js";

test("env overrides file flags", () => {
  const f = loadFlags("config/feature-flags.json", "bxgy=on,orderEmails=off,unknown=on");
  assert.equal(f.bxgy, true);
  assert.equal(isEnabled("orderEmails"), false);
  assert.equal("unknown" in f, false);
  loadFlags("config/feature-flags.json", "");
});
