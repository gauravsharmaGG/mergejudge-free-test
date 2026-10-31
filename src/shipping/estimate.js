// Delivery date estimate in business days (Mon-Fri), skipping weekends. Orders after the cutoff ship next day.
import { zoneFor } from "./zones.js";

const DAYS = { domestic: [1, 2], eu: [3, 5], world: [7, 14] };
export const CUTOFF_HOUR_UTC = 14;

function addBusinessDays(date, n) {
  const d = new Date(date.getTime());
  while (n > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    const wd = d.getUTCDay();
    if (wd !== 0 && wd !== 6) n--;
  }
  return d;
}

export function estimateDelivery(country, orderedAt = new Date()) {
  const [min, max] = DAYS[zoneFor(country)];
  const late = orderedAt.getUTCHours() >= CUTOFF_HOUR_UTC ? 1 : 0;
  return {
    earliest: addBusinessDays(orderedAt, min + late).toISOString().slice(0, 10),
    latest: addBusinessDays(orderedAt, max + late).toISOString().slice(0, 10),
  };
}
