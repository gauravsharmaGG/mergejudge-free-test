// In-memory order store with simple queries. A real deployment would back this with a database.
import { transition } from "./status.js";

export function createOrderStore() {
  const orders = new Map();
  return {
    create({ orderId, customerId, email, totals, currency, lines }) {
      if (orders.has(orderId)) throw new RangeError(`duplicate order ${orderId}`);
      const o = { orderId, customerId, email, totals, currency, lines, status: "placed", history: [], tracking: null };
      orders.set(orderId, o);
      return o;
    },
    get(orderId) { return orders.get(orderId) ?? null; },
    move(orderId, to, note) {
      const o = orders.get(orderId);
      if (!o) throw new RangeError(`unknown order ${orderId}`);
      const next = transition(o, to, note);
      orders.set(orderId, next);
      return next;
    },
    setTracking(orderId, carrier, number) {
      const o = orders.get(orderId);
      if (!o) throw new RangeError(`unknown order ${orderId}`);
      orders.set(orderId, { ...o, tracking: { carrier, number } });
    },
    byCustomer(customerId) { return [...orders.values()].filter((o) => o.customerId === customerId); },
    byStatus(status) { return [...orders.values()].filter((o) => o.status === status); },
    /** Revenue in minor units for orders that were paid and not refunded or cancelled. */
    revenueMinor() {
      let n = 0;
      for (const o of orders.values()) if (!["placed", "cancelled", "refunded"].includes(o.status)) n += o.totals.total;
      return n;
    },
    get size() { return orders.size; },
  };
}
