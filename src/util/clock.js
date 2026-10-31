// Injectable clock so time-dependent code (coupons, reservations) is testable.

let now = () => Date.now();

/** Current time in milliseconds. */
export const clockNow = () => now();

/** Replaces the clock (tests only). Returns a function that restores the previous clock. */
export function setClock(fn) {
  const prev = now;
  now = fn;
  return () => { now = prev; };
}

/** True when `iso` (an ISO date string) is in the past. */
export function isPast(iso) {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) throw new TypeError(`not a date: ${iso}`);
  return t < now();
}
