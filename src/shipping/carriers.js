// Carrier selection. Picks the cheapest carrier that serves the zone and accepts the parcel weight.
import { zoneFor } from "./zones.js";

export const CARRIERS = [
  { id: "dhl", zones: ["domestic", "eu", "world"], maxKg: 31.5, factor: 1.0 },
  { id: "hermes", zones: ["domestic"], maxKg: 25, factor: 0.85 },
  { id: "dpd", zones: ["domestic", "eu"], maxKg: 31.5, factor: 0.95 },
  { id: "ups", zones: ["eu", "world"], maxKg: 70, factor: 1.2 },
];

export function pickCarrier(country, weightGrams, baseMinor) {
  const zone = zoneFor(country);
  const kg = weightGrams / 1000;
  const options = CARRIERS.filter((c) => c.zones.includes(zone) && kg <= c.maxKg)
    .map((c) => ({ id: c.id, priceMinor: Math.round(baseMinor * c.factor) }))
    .sort((a, b) => a.priceMinor - b.priceMinor);
  if (!options.length) throw new RangeError(`no carrier for ${country} at ${kg} kg`);
  return options[0];
}
