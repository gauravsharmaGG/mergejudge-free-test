// Rate cards: base price per zone plus a per-kg surcharge. Free shipping above a threshold (domestic and EU).
import { zoneFor } from "./zones.js";

const CARD = {
  domestic: { baseMinor: 490, perKgMinor: 50, freeAboveMinor: 5000 },
  eu: { baseMinor: 990, perKgMinor: 120, freeAboveMinor: 10000 },
  world: { baseMinor: 2490, perKgMinor: 400, freeAboveMinor: null },
};

export function shippingMinor({ country, weightGrams, subtotalMinor }) {
  const zone = zoneFor(country);
  const card = CARD[zone];
  if (!card) throw new RangeError(`no rate card for zone ${zone}`);
  if (card.freeAboveMinor !== null && subtotalMinor >= card.freeAboveMinor) return 0;
  const kg = Math.ceil(Math.max(0, weightGrams) / 1000);
  return card.baseMinor + Math.max(0, kg - 1) * card.perKgMinor;
}
