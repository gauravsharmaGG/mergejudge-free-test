// Locale-aware money formatting for receipts and emails.
import { decimalsFor } from "./pricing/currency.js";

const LOCALE_BY_CURRENCY = { EUR: "de-DE", USD: "en-US", GBP: "en-GB", JPY: "ja-JP", CHF: "de-CH" };

export function formatMoney(minor, currency, locale = LOCALE_BY_CURRENCY[currency] ?? "en-US") {
  const d = decimalsFor(currency);
  return new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: d, maximumFractionDigits: d }).format(minor / 10 ** d);
}
