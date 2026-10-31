// VAT / sales tax by destination country. Rates come from config/tax-rates.json.
import { readFileSync } from "node:fs";
import { roundWith } from "./rounding.js";

let table = { DE: { standard: 0.19, reduced: 0.07 }, FR: { standard: 0.2, reduced: 0.055 }, US: { standard: 0 } };

export function loadTaxTable(path) {
  table = JSON.parse(readFileSync(path, "utf8"));
  return Object.keys(table).length;
}

/** Tax rate for a country and product class ("standard" | "reduced"). Unknown countries are taxed at 0. */
export function rateFor(country, cls = "standard") {
  const row = table[country];
  if (!row) return 0;
  return row[cls] ?? row.standard ?? 0;
}

/** Tax on a net minor amount. */
export function taxMinor(netMinor, country, cls = "standard", mode = "half-even") {
  return roundWith(mode, netMinor * rateFor(country, cls));
}

/** Splits a gross (tax-inclusive) amount into net and tax. */
export function splitGross(grossMinor, country, cls = "standard") {
  const rate = rateFor(country, cls);
  const net = Math.round(grossMinor / (1 + rate));
  return { net, tax: grossMinor - net };
}
