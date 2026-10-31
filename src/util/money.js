// Money helpers. Amounts are integer minor units (cents) to avoid float drift.

/** Converts a decimal amount (e.g. 12.34) to integer minor units. */
export function toMinor(amount, decimals = 2) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) throw new TypeError("amount must be a finite number");
  const f = 10 ** decimals;
  return Math.round(amount * f);
}

/** Converts integer minor units back to a decimal amount. */
export function fromMinor(minor, decimals = 2) {
  if (!Number.isInteger(minor)) throw new TypeError("minor must be an integer");
  return minor / 10 ** decimals;
}

/** Adds any number of minor-unit amounts. */
export function addMinor(...values) {
  let total = 0;
  for (const v of values) {
    if (!Number.isInteger(v)) throw new TypeError("all values must be integers");
    total += v;
  }
  return total;
}

/** Multiplies a minor amount by a rate (0.19 for 19 %), rounding half away from zero. */
export function applyRate(minor, rate) {
  if (!Number.isInteger(minor)) throw new TypeError("minor must be an integer");
  if (typeof rate !== "number" || rate < 0) throw new RangeError("rate must be a non-negative number");
  const raw = minor * rate;
  return raw < 0 ? -Math.round(-raw) : Math.round(raw);
}

/** Splits a minor amount into `parts` shares that add back up exactly. */
export function allocate(minor, parts) {
  if (!Number.isInteger(parts) || parts <= 0) throw new RangeError("parts must be a positive integer");
  const base = Math.floor(minor / parts);
  let rest = minor - base * parts;
  const out = [];
  for (let i = 0; i < parts; i++) {
    out.push(base + (rest > 0 ? 1 : 0));
    if (rest > 0) rest--;
  }
  return out;
}
