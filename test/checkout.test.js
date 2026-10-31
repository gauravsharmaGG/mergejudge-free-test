import { test } from "node:test";
import assert from "node:assert/strict";
import { createCheckout } from "../src/checkout.js";
import { createCart } from "../src/cart/cart.js";
import { createStock } from "../src/inventory/stock.js";
import { createCouponBook } from "../src/pricing/coupons.js";

function setup({ chargeOk = true } = {}) {
  const stock = createStock({ A: 5 });
  const coupons = createCouponBook([{ code: "SAVE10", kind: "percent", value: 10 }]);
  const gateway = { async charge({ amountMinor }) { if (!chargeOk) throw Object.assign(new Error("declined"), { code: "card_declined" }); return { chargeId: "ch_1", amountMinor }; } };
  const sent = [];
  const notifier = { enqueue: (...a) => sent.push(a) };
  return { stock, sent, co: createCheckout({ stock, coupons, gateway, notifier }) };
}

const input = (cart) => ({ cart, email: "a@b.de", name: "Ana", country: "DE", paymentToken: "tok" });

test("happy path commits stock and queues an email", async () => {
  const { stock, sent, co } = setup();
  const cart = createCart({ customerId: "c1" }).add({ sku: "A", qty: 2, unitMinor: 3000 }).applyCoupon("save10");
  const r = await co.placeOrder(input(cart));
  assert.equal(r.ok, true);
  assert.equal(r.totals.discount, 600);
  assert.equal(r.totals.shipping, 0);
  assert.equal(stock.available("A"), 3);
  assert.equal(sent.length, 1);
});

test("declined charge releases the hold", async () => {
  const { stock, co } = setup({ chargeOk: false });
  const r = await co.placeOrder(input(createCart().add({ sku: "A", qty: 1, unitMinor: 100 })));
  assert.deepEqual([r.ok, r.error], [false, "card_declined"]);
  assert.equal(stock.available("A"), 5);
});

test("unknown coupon releases the hold", async () => {
  const { stock, co } = setup();
  const r = await co.placeOrder(input(createCart().add({ sku: "A", qty: 1, unitMinor: 100 }).applyCoupon("NOPE")));
  assert.equal(r.error, "coupon_unknown");
  assert.equal(stock.available("A"), 5);
});

test("out of stock", async () => {
  const { co } = setup();
  const r = await co.placeOrder(input(createCart().add({ sku: "A", qty: 9, unitMinor: 100 })));
  assert.deepEqual([r.ok, r.error, r.sku], [false, "out_of_stock", "A"]);
});
