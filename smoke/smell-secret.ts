/** Intentional smell: hardcoded token-like string for free-AI smoke. */
export const DEMO_API_KEY = "sk-test-mergejudge-smoke-do-not-use-abc123xyz";
export function authHeader(): string {
  return `Bearer ${DEMO_API_KEY}`;
}
