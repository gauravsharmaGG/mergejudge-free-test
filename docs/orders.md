# Orders

Statuses: placed -> paid -> packed -> shipped -> delivered, with cancelled, returned and refunded as side exits.
Allowed moves are listed in `src/orders/status.js`; anything else throws `TransitionError`. Every move is appended to `history`.

Returns are accepted for 30 days after delivery. Gift cards and digital items cannot be returned. The refund is the unit
price times the returned quantity; shipping is not refunded. Returned units go back into stock with `restock`.

`dailyReport(orders)` gives order count, revenue (refunds excluded), average order value and the top SKUs; `reportCsv` turns it into CSV.
