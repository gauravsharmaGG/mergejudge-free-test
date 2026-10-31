// Small input validators shared by the checkout modules. They throw; callers decide how to report.

export class ValidationError extends Error {
  constructor(field, message) {
    super(`${field}: ${message}`);
    this.name = "ValidationError";
    this.field = field;
  }
}

export function requireString(value, field, { min = 1, max = 200 } = {}) {
  if (typeof value !== "string") throw new ValidationError(field, "must be a string");
  const t = value.trim();
  if (t.length < min) throw new ValidationError(field, `must be at least ${min} characters`);
  if (t.length > max) throw new ValidationError(field, `must be at most ${max} characters`);
  return t;
}

export function requireInt(value, field, { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}) {
  if (!Number.isInteger(value)) throw new ValidationError(field, "must be an integer");
  if (value < min || value > max) throw new ValidationError(field, `must be between ${min} and ${max}`);
  return value;
}

export function requireOneOf(value, field, allowed) {
  if (!allowed.includes(value)) throw new ValidationError(field, `must be one of ${allowed.join(", ")}`);
  return value;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function requireEmail(value, field = "email") {
  const s = requireString(value, field, { min: 3, max: 254 });
  if (!EMAIL.test(s)) throw new ValidationError(field, "is not a valid email address");
  return s.toLowerCase();
}

const COUNTRY = /^[A-Z]{2}$/;
export function requireCountry(value, field = "country") {
  const s = requireString(value, field, { min: 2, max: 2 }).toUpperCase();
  if (!COUNTRY.test(s)) throw new ValidationError(field, "must be a two-letter ISO country code");
  return s;
}
