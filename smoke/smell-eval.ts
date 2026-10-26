/** Intentional smell: dynamic eval for free-AI smoke. */
export function runUserCode(code: string): unknown {
  // mergejudge-smoke: do not copy — triggers review lane
  return eval(code);
}
