// Order status state machine. Only listed transitions are allowed; every change is recorded with a timestamp.
import { clockNow } from "../util/clock.js";

export const TRANSITIONS = {
  placed: ["paid", "cancelled"],
  paid: ["packed", "refunded", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["delivered", "returned"],
  delivered: ["returned"],
  returned: ["refunded"],
  refunded: [],
  cancelled: [],
};

export class TransitionError extends Error {
  constructor(from, to) { super(`cannot move order from ${from} to ${to}`); this.name = "TransitionError"; this.from = from; this.to = to; }
}

export function canTransition(from, to) {
  return (TRANSITIONS[from] ?? []).includes(to);
}

export function transition(order, to, note = "") {
  if (!canTransition(order.status, to)) throw new TransitionError(order.status, to);
  return { ...order, status: to, history: [...order.history, { from: order.status, to, at: clockNow(), note }] };
}

export const isFinal = (status) => (TRANSITIONS[status] ?? []).length === 0;
