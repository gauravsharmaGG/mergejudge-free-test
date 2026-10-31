// Cart reservations with a TTL. Reserving a cart is all-or-nothing; expired holds are released on sweep.
import { clockNow } from "../util/clock.js";

export const HOLD_MS = 15 * 60 * 1000;

export function createReservations(stock) {
  const holds = new Map(); // id -> { lines, expiresAt }
  let seq = 0;
  return {
    hold(lines) {
      const done = [];
      for (const l of lines) {
        if (!stock.reserve(l.sku, l.qty)) {
          for (const d of done) stock.release(d.sku, d.qty);
          return { ok: false, sku: l.sku };
        }
        done.push(l);
      }
      const id = `h${++seq}`;
      holds.set(id, { lines: done, expiresAt: clockNow() + HOLD_MS });
      return { ok: true, id };
    },
    confirm(id) {
      const h = holds.get(id);
      if (!h) throw new RangeError(`unknown or expired hold ${id}`);
      for (const l of h.lines) stock.commit(l.sku, l.qty);
      holds.delete(id);
    },
    cancel(id) {
      const h = holds.get(id);
      if (!h) return false;
      for (const l of h.lines) stock.release(l.sku, l.qty);
      holds.delete(id);
      return true;
    },
    sweep() {
      let n = 0;
      for (const [id, h] of holds) if (h.expiresAt <= clockNow()) { this.cancel(id); n++; }
      return n;
    },
    get size() { return holds.size; },
  };
}
