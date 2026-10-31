// Feature flags from config/feature-flags.json, overridable with MJ_FLAGS="name=on,other=off".
import { readFileSync } from "node:fs";

const DEFAULTS = { orderEmails: true, carrierPicker: true, bxgy: false };
let flags = { ...DEFAULTS };

export function loadFlags(path, env = process.env.MJ_FLAGS ?? "") {
  try { flags = { ...DEFAULTS, ...JSON.parse(readFileSync(path, "utf8")) }; } catch { flags = { ...DEFAULTS }; }
  for (const pair of env.split(",").filter(Boolean)) {
    const [k, v] = pair.split("=");
    if (k in DEFAULTS) flags[k] = v === "on" || v === "true";
  }
  return { ...flags };
}

export const isEnabled = (name) => flags[name] === true;
