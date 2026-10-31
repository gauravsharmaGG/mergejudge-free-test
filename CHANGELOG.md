# Changelog

## Unreleased

- Added: checkout pipeline (cart, pricing, coupons, tax, shipping, carriers, inventory holds, payments, refunds, email).
- Added: signed payment webhooks with replay protection.
- Added: orders (status machine, store, returns, daily report).
- Added: config files for tax rates, shipping zones, currency rates and feature flags.
- Changed: `src/math.js` moved to `src/lib/math.js`; `sum` now skips non-finite values. Added `average` and `clamp`.
- Changed: `src/index.js` re-exports the checkout API; `total` is deprecated.
- Changed: lint scans `src/` recursively.
