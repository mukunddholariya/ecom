# Phase 06 — Checkout, Simulated Online Payment, COD, and Mock Order Placement

Read `MASTER_CONTEXT.md` first.

## Goal

Create a demo checkout journey that calculates totals consistently and creates a local mock order. This phase must not process real payments.

## Required flow

1. Checkout entry from the cart.
2. If the prototype requires a mock login to place an order, redirect to login and return to checkout afterward. Do not block browsing or cart access.
3. Address form with name, phone, address line, city, state, PIN code, and optional landmark. Validate required fields and sensible PIN/phone formats for India.
4. Show a clear order summary with products, quantities, subtotal, delivery charge, discount if any, and final total.
5. For this prototype, delivery charge and discount rules must be simple, deterministic, and documented. Do not invent promotional claims.
6. Offer payment method choices:
   - “Online payment (demo)” — simulated success/failure only
   - “Cash on Delivery”
7. Never collect card numbers, CVV, UPI PIN, bank credentials, or other payment secrets.
8. Clearly explain that online payment is simulated and no money will be charged.
9. Before placing an order, recalculate totals from trusted local product data and validate stock/quantities. Do not trust prices supplied by browser form state or localStorage.
10. Create a mock order with:
    - unique demo order ID
    - creation timestamp
    - item snapshots (name, SKU if available, unit price, quantity, line total)
    - address snapshot
    - subtotal, delivery, discount, grand total
    - payment method and demo payment status
    - order status
11. Prevent accidental duplicate submissions while the order is being created.
12. Show an order-confirmation page with order ID, summary, payment mode, and links to order history/home.
13. Clear the cart only after mock order creation succeeds.
14. If simulated payment fails, keep the cart and allow retry or switching to COD.
15. For COD, show a pending/awaiting confirmation status rather than implying money has been collected.
16. Store mock orders only in the chosen prototype storage layer and document its limitations.

## Data integrity rules

- Use one shared total-calculation function.
- Keep price representation consistent (prefer integer paise).
- Snapshot product names/prices into the mock order so later fixture edits do not rewrite past order summaries.
- Use distinct order status and payment status fields.
- Treat localStorage data as untrusted and validate it before use.
- Do not decrement shared production inventory; this is a local simulation only.

## Acceptance checklist

- Invalid address data blocks placement with useful messages.
- Cart summary and checkout total agree.
- Online demo clearly states no real charge occurs.
- COD order can be placed.
- Simulated payment failure does not clear the cart.
- Successful order produces a confirmation with a unique ID.
- Order history can read the created order.
- No real payment gateway, database, email, SMS, or shipping API is connected.

## Final report

Explain total calculation rules, mock payment outcomes, order storage, duplicate-submit handling, and checks actually run.
