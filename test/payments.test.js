import { test } from "node:test";
import assert from "node:assert/strict";
import { createGateway, PaymentError } from "../src/payments/gateway.js";
import { createRefunds } from "../src/payments/refunds.js";

const fakeTransport = (responses) => {
  const calls = [];
  return { calls, async post(path, body) { calls.push({ path, body }); const r = responses.shift(); if (r instanceof Error) throw r; return r; } };
};

test("charge retries on timeout and is idempotent", async () => {
  const timeout = Object.assign(new Error("t"), { code: "timeout" });
  const tr = fakeTransport([timeout, { status: "succeeded", id: "ch_1" }]);
  const g = createGateway(tr);
  const a = await g.charge({ orderId: "O1", amountMinor: 100, currency: "EUR", paymentToken: "tok" });
  const b = await g.charge({ orderId: "O1", amountMinor: 100, currency: "EUR", paymentToken: "tok" });
  assert.equal(a.chargeId, "ch_1");
  assert.equal(b.chargeId, "ch_1");
  assert.equal(tr.calls.length, 2);
});

test("declines are not retried", async () => {
  const tr = fakeTransport([{ status: "failed", error: "card_declined" }]);
  await assert.rejects(createGateway(tr).charge({ orderId: "O2", amountMinor: 100, currency: "EUR" }), PaymentError);
  assert.equal(tr.calls.length, 1);
});

test("refunds cannot exceed the captured amount", async () => {
  const tr = fakeTransport([{ status: "succeeded", id: "re_1" }]);
  const r = createRefunds(tr);
  assert.equal((await r.refund({ chargeId: "ch", capturedMinor: 1000, amountMinor: 600 })).remainingMinor, 400);
  await assert.rejects(r.refund({ chargeId: "ch", capturedMinor: 1000, amountMinor: 600 }), (e) => e.code === "over_refund");
});
