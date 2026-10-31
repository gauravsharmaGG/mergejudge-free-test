# Checkout

`createCheckout({ stock, coupons, gateway, notifier })` returns `placeOrder(input)`.

Order of operations:

1. Validate the cart, email and destination country.
2. Reserve stock for every line (all or nothing, 15 minute hold).
3. Quote the coupon, if any. A bad coupon cancels the hold and returns `coupon_<reason>`.
4. Compute shipping (free above the zone threshold) and pick the cheapest carrier.
5. Compute tax per tax class after the discount, plus tax on shipping.
6. Charge the gateway with an idempotency key `charge:<orderId>`; retry on timeout, rate limit, unavailable.
7. On success: commit stock, redeem the coupon, queue the confirmation email.
8. On any failure: cancel the hold and return `{ ok: false, error }`.

`sweepHolds()` releases expired holds; call it from a timer.

Payment webhooks (`src/payments/webhooks.js`) are verified with an HMAC-SHA256 header `t=<ms>,v1=<hex>`, rejected when older than 5 minutes, and deduplicated by event id.
