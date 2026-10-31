// Stock levels per SKU. `available` = onHand - reserved. Never goes negative.

export function createStock(initial = {}) {
  const onHand = new Map(Object.entries(initial));
  const reserved = new Map();
  const get = (m, k) => m.get(k) ?? 0;
  return {
    available(sku) { return Math.max(0, get(onHand, sku) - get(reserved, sku)); },
    reserve(sku, qty) {
      if (qty > this.available(sku)) return false;
      reserved.set(sku, get(reserved, sku) + qty);
      return true;
    },
    release(sku, qty) { reserved.set(sku, Math.max(0, get(reserved, sku) - qty)); },
    /** Converts a reservation into a shipment: both onHand and reserved drop. */
    commit(sku, qty) {
      const r = get(reserved, sku);
      if (qty > r) throw new RangeError(`cannot commit ${qty} of ${sku}; only ${r} reserved`);
      reserved.set(sku, r - qty);
      onHand.set(sku, get(onHand, sku) - qty);
    },
    restock(sku, qty) { onHand.set(sku, get(onHand, sku) + qty); },
    snapshot() { return Object.fromEntries([...onHand.keys()].map((k) => [k, { onHand: get(onHand, k), reserved: get(reserved, k) }])); },
  };
}
