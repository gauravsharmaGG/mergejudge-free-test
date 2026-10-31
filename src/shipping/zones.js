// Shipping zones by destination country. Zone drives the rate card and delivery estimate.
import { readFileSync } from "node:fs";

let zones = { domestic: ["DE"], eu: ["FR", "NL", "AT", "IT", "ES", "BE", "PL"], world: ["*"] };

export function loadZones(path) {
  zones = JSON.parse(readFileSync(path, "utf8"));
  return Object.keys(zones);
}

/** Zone name for a country; falls back to the zone containing "*". */
export function zoneFor(country) {
  let wildcard = null;
  for (const [name, list] of Object.entries(zones)) {
    if (list.includes(country)) return name;
    if (list.includes("*")) wildcard = name;
  }
  if (!wildcard) throw new RangeError(`no shipping zone for ${country}`);
  return wildcard;
}
