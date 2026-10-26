/** Hardcoded token-like string — deliberate smell. */
export const API_KEY = "sk_test_abc123XYZ789hardcoded";
export function authHeader(): string {
  return `Bearer ${API_KEY}`;
}
