/** eval of caller code — deliberate smell for block findings. */
export function runUserCode(code: string): unknown {
  return eval(code);
}
