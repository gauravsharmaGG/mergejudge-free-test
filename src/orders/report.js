// Daily sales report: order count, revenue, average order value, top SKUs. Money in minor units.

export function dailyReport(orders, { top = 3 } = {}) {
  const paid = orders.filter((o) => !["placed", "cancelled"].includes(o.status));
  const revenue = paid.reduce((n, o) => n + (o.status === "refunded" ? 0 : o.totals.total), 0);
  const units = new Map();
  for (const o of paid) for (const l of o.lines) units.set(l.sku, (units.get(l.sku) ?? 0) + l.qty);
  const topSkus = [...units.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, top).map(([sku, qty]) => ({ sku, qty }));
  return {
    orders: paid.length,
    revenueMinor: revenue,
    averageMinor: paid.length ? Math.round(revenue / paid.length) : 0,
    refunded: paid.filter((o) => o.status === "refunded").length,
    topSkus,
  };
}

/** Renders the report as CSV lines (header + one row). */
export function reportCsv(r) {
  return ["orders,revenue_minor,average_minor,refunded,top_skus", `${r.orders},${r.revenueMinor},${r.averageMinor},${r.refunded},${r.topSkus.map((t) => `${t.sku}:${t.qty}`).join("|")}`].join("\n");
}
