# Phase 08 — UI Polish, Accessibility, and End-to-End QA

Read `MASTER_CONTEXT.md` first. Audit the full implementation from Phases 01–07 before making changes.

## Goal

Stabilize the prototype and fix real defects without adding new major features or integrations.

## Review checklist

### Functional journey
- Home → product listing → product details → add to cart → update/remove cart items
- Search, category filter, and sorting
- Login using mock phone OTP
- Login using mock email OTP
- Checkout with simulated online payment success
- Checkout with simulated online payment failure and retry
- Checkout with Cash on Delivery
- Order confirmation → order history → order detail
- Logout and login again
- Empty cart, no search results, unavailable product, invalid slug, invalid order ID

### Responsive behavior
- Small mobile viewport
- Larger mobile/tablet viewport
- Desktop viewport
- No unintended horizontal overflow
- Navigation, product cards, forms, cart, and checkout remain usable

### Accessibility
- Semantic headings and landmarks
- Form labels and accessible validation messages
- Keyboard navigation and visible focus
- Buttons/links have meaningful names
- Dialogs/menus, if present, are keyboard accessible
- Images have suitable alt text or are marked decorative
- Do not rely on color alone for status/error messages

### Data and runtime safety
- Malformed localStorage data does not crash the app
- No localStorage/window access during server render
- No hydration mismatch warnings
- Cart and checkout totals are consistent
- Stock limits are enforced
- Order snapshots preserve prices/names
- No real secrets, OTPs, or payment details are stored
- No claims of real payment/auth/order fulfillment

### Code quality
- Remove only genuinely unused code introduced during these phases.
- Avoid broad refactors unrelated to defects.
- Check imports, TypeScript, lint, and build using scripts available in `package.json`.
- Do not install a dependency just to fix a small issue if the existing stack can handle it.
- Preserve shadcn/ui, Tailwind tokens, RTL, theme support, and generated instructions.

## Required output

1. Fix verified issues discovered in the review.
2. Report the exact checks/commands run and their results.
3. Provide a concise manual test checklist.
4. List known prototype limitations and what must change before production.
5. Do not connect production services in this phase.

## Production-readiness note

Before launch, the prototype will need a real database, server-side authorization, a real OTP/auth provider, server-side order creation, a payment gateway with verified webhooks, stock/fulfillment rules, privacy/security review, deployment configuration, and appropriate policies. Do not claim production readiness just because the demo flows work.
