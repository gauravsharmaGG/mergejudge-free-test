// One cart line: SKU, quantity, unit price in minor units, tax class.
import { requireString, requireInt, requireOneOf } from "../util/validate.js";

export const MAX_QTY = 99;

export function makeLine({ sku, qty, unitMinor, taxClass = "standard", name = "" }) {
  return {
    sku: requireString(sku, "sku", { max: 40 }),
    qty: requireInt(qty, "qty", { min: 1, max: MAX_QTY }),
    unitMinor: requireInt(unitMinor, "unitMinor", { min: 0 }),
    taxClass: requireOneOf(taxClass, "taxClass", ["standard", "reduced"]),
    name: typeof name === "string" ? name.slice(0, 120) : "",
  };
}

export const lineTotal = (l) => l.qty * l.unitMinor;
