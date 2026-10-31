// Payment gateway adapter. The transport is injected; this module adds retries, idempotency and error mapping.
import { retry } from "../util/retry.js";
import { createIdempotencyStore } from "./idempotency.js";

export class PaymentError extends Error {
  constructor(code, message) { super(message); this.name = "PaymentError"; this.code = code; }
}

const RETRYABLE = new Set(["timeout", "rate_limited", "unavailable"]);

export function createGateway(transport, { attempts = 3 } = {}) {
  const idem = createIdempotencyStore();
  return {
    async charge({ orderId, amountMinor, currency, paymentToken }) {
      if (!Number.isInteger(amountMinor) || amountMinor <= 0) throw new PaymentError("invalid_amount", "amount must be a positive integer");
      return idem.run(`charge:${orderId}`, () =>
        retry(async () => {
          const res = await transport.post("/charges", { orderId, amountMinor, currency, paymentToken });
          if (res.status === "succeeded") return { chargeId: res.id, amountMinor };
          throw new PaymentError(res.error ?? "declined", `charge failed: ${res.error ?? "declined"}`);
        }, { attempts, retryOn: (e) => RETRYABLE.has(e.code) }),
      );
    },
  };
}
