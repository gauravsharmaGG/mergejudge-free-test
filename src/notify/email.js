// Email notifications. The mailer is injected; sends are queued and flushed so checkout never blocks on SMTP.
import { render } from "./templates.js";
import { requireEmail } from "../util/validate.js";

export function createNotifier(mailer, { from = "shop@example.test" } = {}) {
  const queue = [];
  return {
    enqueue(template, to, vars) {
      queue.push({ from, to: requireEmail(to, "to"), subject: subjectFor(template, vars), text: render(template, vars) });
      return queue.length;
    },
    async flush() {
      let sent = 0;
      const failed = [];
      while (queue.length) {
        const msg = queue.shift();
        try { await mailer.send(msg); sent++; } catch { failed.push(msg); }
      }
      queue.push(...failed); // keep failures for the next flush
      return { sent, failed: failed.length };
    },
    get pending() { return queue.length; },
  };
}

function subjectFor(template, vars) {
  switch (template) {
    case "orderConfirmed": return `Order ${vars.orderId} confirmed`;
    case "orderShipped": return `Order ${vars.orderId} shipped`;
    case "refundIssued": return `Refund for order ${vars.orderId}`;
    default: return "Update on your order";
  }
}
