// Currency table and conversion. Rates are units of the currency per 1 EUR, loaded from config.
import { readFileSync } from "node:fs";

const DEFAULT_RATES = { EUR: 1, USD: 1.08, GBP: 0.86, JPY: 162.4, CHF: 0.95 };
const DECIMALS = { EUR: 2, USD: 2, GBP: 2, JPY: 0, CHF: 2 };

let rates = { ...DEFAULT_RATES };

/** Loads rates from a JSON file ({"USD": 1.08, ...}); unknown codes are ignored. */
export function loadRates(path) {
  const data = JSON.parse(readFileSync(path, "utf8"));
  const next = { EUR: 1 };
  for (const [code, rate] of Object.entries(data)) {
    if (code in DECIMALS && typeof rate === "number" && rate > 0) next[code] = rate;
  }
  rates = { ...DEFAULT_RATES, ...next };
  return Object.keys(rates).length;
}

export const decimalsFor = (code) => {
  if (!(code in DECIMALS)) throw new RangeError(`unsupported currency ${code}`);
  return DECIMALS[code];
};

/** Converts minor units between currencies via EUR, rounding to the target's minor unit. */
export function convertMinor(minor, from, to) {
  if (from === to) return minor;
  const major = minor / 10 ** decimalsFor(from);
  const eur = major / rates[from];
  return Math.round(eur * rates[to] * 10 ** decimalsFor(to));
}
