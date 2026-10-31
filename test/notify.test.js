import { test } from "node:test";
import assert from "node:assert/strict";
import { createNotifier } from "../src/notify/email.js";
import { render } from "../src/notify/templates.js";

test("templates fill placeholders", () => {
  assert.match(render("orderShipped", { name: "Ana", orderId: "O1", carrier: "dhl" }), /O1 shipped with dhl/);
});

test("failed sends stay queued", async () => {
  let fail = true;
  const n = createNotifier({ async send() { if (fail) throw new Error("smtp"); } });
  n.enqueue("orderShipped", "a@b.de", { orderId: "O1" });
  assert.deepEqual(await n.flush(), { sent: 0, failed: 1 });
  fail = false;
  assert.deepEqual(await n.flush(), { sent: 1, failed: 0 });
});
