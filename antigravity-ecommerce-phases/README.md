# Antigravity Ecommerce Build Plan

This pack contains phase-by-phase Markdown prompts for building a physical-products ecommerce website in an existing Next.js project.

## How to use

1. Copy this folder into your project root, or open the Markdown files beside your project.
2. Start with `MASTER_CONTEXT.md` so Antigravity has the permanent project context.
3. Assign one phase file at a time, in numerical order.
4. Do not start the next phase until the current phase is implemented, reviewed, and its acceptance checklist passes.
5. In every phase, ask Antigravity to inspect the existing project before editing it and to summarize changed files and checks performed.

## Files

- `MASTER_CONTEXT.md` — shared product requirements and implementation rules.
- `phases/PHASE_00_AUDIT.md` — inspect the current project and make a plan.
- `phases/PHASE_01_FOUNDATION.md` — shared structure, dummy data, utilities, and design-system foundation.
- `phases/PHASE_02_HOME_PAGE.md` — ecommerce home page.
- `phases/PHASE_03_PRODUCT_CATALOG_AND_PDP.md` — product listing, filters, sorting, and product details.
- `phases/PHASE_04_CART.md` — cart and quantity management.
- `phases/PHASE_05_LOGIN_OTP_UI.md` — phone/email OTP flow using mock verification only.
- `phases/PHASE_06_CHECKOUT_AND_ORDER_PLACEMENT.md` — addresses, delivery, simulated payment, COD, and mock orders.
- `phases/PHASE_07_ACCOUNT_AND_ORDER_HISTORY.md` — account, addresses, and order history.
- `phases/PHASE_08_POLISH_AND_QA.md` — responsive, accessibility, error/empty states, and end-to-end checks.

## Important

This is a frontend prototype using local JSON/mock data. It must not claim to send real OTPs, charge real payments, create real shipments, or securely persist customer data. The mock implementation is for development only and must be replaced before production.
