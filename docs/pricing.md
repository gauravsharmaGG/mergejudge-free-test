# Pricing

- Money is integer minor units everywhere (`src/util/money.js`).
- Tax rates live in `config/tax-rates.json`; unknown countries pay 0 %.
- Rounding defaults to half-even for tax.
- Discounts do not stack; `bestDiscount` picks the largest.
- Coupons are case-insensitive, may expire, have a per-customer limit (default 1) and an optional minimum subtotal.
- Currency conversion goes through EUR using `config/currency-rates.json`.
