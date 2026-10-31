// Idempotency keys for payment calls: the same key returns the first result instead of charging twice.

export function createIdempotencyStore({ ttlMs = 24 * 3600 * 1000, now = () => Date.now() } = {}) {
  const entries = new Map();
  return {
    async run(key, fn) {
      const hit = entries.get(key);
      if (hit && hit.expiresAt > now()) return hit.promise;
      const promise = Promise.resolve().then(fn);
      entries.set(key, { promise, expiresAt: now() + ttlMs });
      try {
        return await promise;
      } catch (e) {
        entries.delete(key); // failed calls may be retried with the same key
        throw e;
      }
    },
    get size() { return entries.size; },
  };
}
