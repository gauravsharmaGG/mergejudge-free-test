import { test } from "node:test";
import assert from "node:assert/strict";
import { sign, verify, createWebhookRouter, WebhookError, TOLERANCE_MS } from "../src/payments/webhooks.js";

const SECRET = "whsec_test_dummy";
const body = JSON.stringify({ id: "evt_1", type: "charge.refunded", data: { chargeId: "ch_1" } });

test("valid signature is accepted", () => {
  const t = 1_000_000;
  const ev = verify(SECRET, `t=${t},v1=${sign(SECRET, t, body)}`, body, t + 1000);
  assert.equal(ev.id, "evt_1");
});

test("bad signature and stale timestamp are rejected", () => {
  const t = 1_000_000;
  assert.throws(() => verify(SECRET, `t=${t},v1=${"00".repeat(32)}`, body, t), (e) => e instanceof WebhookError && e.reason === "bad signature");
  assert.throws(() => verify(SECRET, `t=${t},v1=${sign(SECRET, t, body)}`, body, t + TOLERANCE_MS + 1), /tolerance/);
  assert.throws(() => verify(SECRET, "garbage", body, t), /malformed/);
});

test("router dedupes and ignores unknown types", async () => {
  const got = [];
  const handle = createWebhookRouter({ "charge.refunded": async (d) => got.push(d.chargeId) });
  assert.deepEqual(await handle({ id: "e1", type: "charge.refunded", data: { chargeId: "ch_1" } }), { status: "handled" });
  assert.deepEqual(await handle({ id: "e1", type: "charge.refunded", data: { chargeId: "ch_1" } }), { status: "duplicate" });
  assert.deepEqual(await handle({ id: "e2", type: "customer.created", data: {} }), { status: "ignored" });
  assert.deepEqual(got, ["ch_1"]);
});
