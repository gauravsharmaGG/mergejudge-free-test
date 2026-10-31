// Payment webhooks: verify the HMAC signature, reject replays older than 5 minutes, dispatch by event type.
import { createHmac, timingSafeEqual } from "node:crypto";

export const TOLERANCE_MS = 5 * 60 * 1000;

export class WebhookError extends Error {
  constructor(reason) { super(`webhook rejected: ${reason}`); this.name = "WebhookError"; this.reason = reason; }
}

export function sign(secret, timestamp, body) {
  return createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
}

/** Verifies `t=<ms>,v1=<hex>` and returns the parsed event. */
export function verify(secret, header, body, now = Date.now()) {
  const parts = Object.fromEntries(String(header).split(",").map((p) => p.split("=")));
  const t = Number(parts.t);
  if (!Number.isFinite(t) || !parts.v1) throw new WebhookError("malformed signature header");
  if (Math.abs(now - t) > TOLERANCE_MS) throw new WebhookError("timestamp outside tolerance");
  const expected = Buffer.from(sign(secret, t, body), "hex");
  const got = Buffer.from(parts.v1, "hex");
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) throw new WebhookError("bad signature");
  return JSON.parse(body);
}

/** Routes verified events to handlers; unknown types are acknowledged and ignored. */
export function createWebhookRouter(handlers) {
  const seen = new Set();
  return async function handle(event) {
    if (seen.has(event.id)) return { status: "duplicate" };
    seen.add(event.id);
    const h = handlers[event.type];
    if (!h) return { status: "ignored" };
    await h(event.data);
    return { status: "handled" };
  };
}
