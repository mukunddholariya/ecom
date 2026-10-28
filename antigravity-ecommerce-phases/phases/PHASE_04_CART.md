# Phase 04 — Cart

Read `MASTER_CONTEXT.md` and reuse the product models from earlier phases.

## Goal

Implement a functional cart backed by local product data. The cart is a prototype, not a server-side cart.

## Requirements

1. Create one cart state/data layer. Do not implement separate cart logic in individual pages.
2. Cart item records should reference product IDs and contain quantity. Derive current product name, image, stock, and price from product data rather than trusting stale cart copies.
3. Support:
   - add product to cart
   - add the same product again by incrementing quantity
   - update quantity
   - remove an item
   - clear cart if appropriate
   - calculate item subtotal and cart subtotal
   - display item count
4. Validate stock and quantity. Never allow quantity below 1 or above current stock. Handle products that disappear or become unavailable.
5. Use a small, well-defined client-side state approach that fits the current project. Do not add a state library unless necessary.
6. If localStorage is used:
   - access it only on the client
   - avoid server/client hydration mismatches
   - validate parsed data and handle malformed JSON
   - version the storage key if helpful
   - treat stored data as untrusted
   - do not store personal or payment data
7. Cart page should include product image, title, price, quantity controls, remove action, line subtotal, overall subtotal, empty state, and a checkout CTA.
8. Add-to-cart feedback should be accessible and not rely only on color.
9. Header cart count should stay in sync with cart state.
10. Product cards and product details page should use the same cart API.
11. Clearly document that cart persistence is demo-only and not secure or cross-device.

## Acceptance checklist

- Adding a product works from listing/detail surfaces where supported.
- Re-adding increments quantity instead of duplicating a line.
- Quantity updates, removal, subtotal, and item count stay in sync.
- Stock limits are enforced.
- Empty cart has a useful CTA back to shopping.
- localStorage parsing errors do not crash the app.
- No sensitive data is persisted.

## Out of scope

Do not implement real checkout, payment, or login yet.

## Final report

Describe the cart state approach, persistence behavior, stock handling, files changed, and checks actually run.
