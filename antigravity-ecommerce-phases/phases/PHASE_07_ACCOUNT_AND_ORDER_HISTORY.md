# Phase 07 — Account, Addresses, and Order History

Read `MASTER_CONTEXT.md` first.

## Goal

Complete the demo customer account area using the mock session and mock orders from previous phases.

## Pages/features

- Account overview
- Profile summary based on the mock login identity
- Address book: list, add, edit, and delete demo addresses if practical
- Order history list
- Order detail page with item snapshots, totals, address snapshot, payment method/status, and order status
- Logout action

## Requirements

1. Reuse the mock session/auth API from Phase 05; do not create a second login/session system.
2. Reuse the order data model/storage from Phase 06; do not create duplicate order stores.
3. Show useful empty states for no saved addresses and no orders.
4. Validate address data consistently with checkout.
5. Make order details readable on mobile and desktop.
6. If route protection is implemented, handle unauthenticated users safely and return them to the intended page after mock login. Do not assume client-side checks are real security.
7. Use a stable demo order ID for route lookup and handle missing/invalid IDs with a not-found state.
8. Clearly explain that profile, addresses, and orders are temporary demo data stored in the browser and are not backed up or shared across devices.
9. Do not store more personal information than the prototype needs.
10. Keep the order detail page based on immutable order snapshots rather than current product fixture values.

## Acceptance checklist

- Account links work.
- Address create/edit/delete behaves consistently.
- Order history displays placed mock orders.
- Order detail loads the correct order and handles unknown IDs.
- Logout updates the header/account UI.
- Empty states and responsive layouts are implemented.
- No real backend/auth integration is added.

## Final report

List the pages completed, shared state/data functions reused, persistence limitations, and checks actually run.
