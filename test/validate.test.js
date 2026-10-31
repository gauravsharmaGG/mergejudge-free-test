import { test } from "node:test";
import assert from "node:assert/strict";
import { requireString, requireInt, requireEmail, requireCountry, ValidationError } from "../src/util/validate.js";

test("strings are trimmed and bounded", () => {
  assert.equal(requireString("  ab ", "x"), "ab");
  assert.throws(() => requireString("", "x"), ValidationError);
});

test("ints respect bounds", () => {
  assert.equal(requireInt(3, "n", { min: 1, max: 5 }), 3);
  assert.throws(() => requireInt(9, "n", { max: 5 }), ValidationError);
});

test("email and country", () => {
  assert.equal(requireEmail("A@B.de"), "a@b.de");
  assert.throws(() => requireEmail("nope"), ValidationError);
  assert.equal(requireCountry("de"), "DE");
});
