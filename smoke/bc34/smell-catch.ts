/** Empty catch — deliberate smell for sticky findings. */
export function swallow(fn: () => void): void {
  try {
    fn();
  } catch (e) {
    // intentionally empty
  }
}
