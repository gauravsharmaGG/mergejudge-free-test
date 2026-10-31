// Plain-text email templates. Placeholders are {{name}}; unknown placeholders are left empty.

export const TEMPLATES = {
  orderConfirmed: "Hi {{name}},\n\nThanks for your order {{orderId}}. Total: {{total}}.\nEstimated delivery: {{earliest}} - {{latest}}.\n",
  orderShipped: "Hi {{name}},\n\nYour order {{orderId}} shipped with {{carrier}}.\n",
  refundIssued: "Hi {{name}},\n\nWe refunded {{amount}} for order {{orderId}}.\n",
};

export function render(name, vars) {
  const tpl = TEMPLATES[name];
  if (!tpl) throw new RangeError(`unknown template ${name}`);
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] === undefined ? "" : String(vars[k])));
}
