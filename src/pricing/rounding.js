// Rounding modes used for tax and discounts. "half-even" is the accounting default (banker's rounding).

export function roundHalfEven(x) {
  const r = Math.round(x);
  const diff = Math.abs(x % 1);
  if (diff === 0.5) return r % 2 === 0 ? r : r - 1;
  return r;
}

export function roundHalfUp(x) {
  return x < 0 ? -Math.round(-x) : Math.round(x);
}

export function roundWith(mode, x) {
  switch (mode) {
    case "half-even": return roundHalfEven(x);
    case "half-up": return roundHalfUp(x);
    case "floor": return Math.floor(x);
    case "ceil": return Math.ceil(x);
    default: throw new RangeError(`unknown rounding mode ${mode}`);
  }
}
