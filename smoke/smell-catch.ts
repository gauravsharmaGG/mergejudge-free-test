/** Intentional smell: empty catch for free-AI smoke. */
export function safeParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch (e) {
    // swallow
  }
  return null;
}
