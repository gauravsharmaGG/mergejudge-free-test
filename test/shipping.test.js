import { test } from "node:test";
import assert from "node:assert/strict";
import { zoneFor } from "../src/shipping/zones.js";
import { shippingMinor } from "../src/shipping/rates.js";
import { pickCarrier } from "../src/shipping/carriers.js";
import { estimateDelivery } from "../src/shipping/estimate.js";

test("zones", () => {
  assert.equal(zoneFor("DE"), "domestic");
  assert.equal(zoneFor("FR"), "eu");
  assert.equal(zoneFor("JP"), "world");
});

test("free shipping threshold and weight surcharge", () => {
  assert.equal(shippingMinor({ country: "DE", weightGrams: 500, subtotalMinor: 6000 }), 0);
  assert.equal(shippingMinor({ country: "DE", weightGrams: 2500, subtotalMinor: 1000 }), 590);
  assert.equal(shippingMinor({ country: "JP", weightGrams: 100, subtotalMinor: 999999 }), 2490);
});

test("cheapest carrier wins", () => {
  assert.equal(pickCarrier("DE", 1000, 490).id, "hermes");
  assert.equal(pickCarrier("FR", 1000, 990).id, "dpd");
  assert.equal(pickCarrier("JP", 40000, 2490).id, "ups");
});

test("delivery skips the weekend", () => {
  const fri = new Date("2026-10-30T10:00:00Z");
  assert.deepEqual(estimateDelivery("DE", fri), { earliest: "2026-11-02", latest: "2026-11-03" });
});
