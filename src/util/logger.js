// Minimal structured logger. Levels below the threshold are dropped. Never logs card data.

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const REDACT = new Set(["card", "cardNumber", "cvc", "password", "token"]);

export function createLogger({ level = "info", sink = console.log } = {}) {
  const min = LEVELS[level] ?? LEVELS.info;
  const emit = (lvl, msg, fields = {}) => {
    if (LEVELS[lvl] < min) return;
    const safe = {};
    for (const [k, v] of Object.entries(fields)) safe[k] = REDACT.has(k) ? "[redacted]" : v;
    sink(JSON.stringify({ level: lvl, msg, ...safe }));
  };
  return {
    debug: (m, f) => emit("debug", m, f),
    info: (m, f) => emit("info", m, f),
    warn: (m, f) => emit("warn", m, f),
    error: (m, f) => emit("error", m, f),
  };
}
