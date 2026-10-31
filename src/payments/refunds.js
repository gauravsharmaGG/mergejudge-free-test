// Refunds: partial or full, never more than the captured amount minus earlier refunds.
import { PaymentError } from "./gateway.js";

export function createRefunds(transport) {
  const refunded = new Map(); // chargeId -> minor refunded so far
  return {
    async refund({ chargeId, capturedMinor, amountMinor = capturedMinor, reason = "requested_by_customer" }) {
      const prior = refunded.get(chargeId) ?? 0;
      if (amountMinor <= 0) throw new PaymentError("invalid_amount", "refund must be positive");
      if (prior + amountMinor > capturedMinor) throw new PaymentError("over_refund", `refund exceeds captured amount (${capturedMinor - prior} left)`);
      const res = await transport.post("/refunds", { chargeId, amountMinor, reason });
      if (res.status !== "succeeded") throw new PaymentError(res.error ?? "refund_failed", "refund failed");
      refunded.set(chargeId, prior + amountMinor);
      return { refundId: res.id, remainingMinor: capturedMinor - prior - amountMinor };
    },
    refundedFor(chargeId) { return refunded.get(chargeId) ?? 0; },
  };
}
