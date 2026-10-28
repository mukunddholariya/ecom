# Master Context — Ecommerce Website Prototype

## Product goal

Build a polished, responsive ecommerce storefront for physical products. The initial catalogue contains approximately 1–50 products. The visual direction may take broad usability inspiration from Amazon India, Flipkart, and Meesho, but must use an original layout, branding, copy, and visual identity. Do not copy their logos, exact layouts, or proprietary assets.

## Current development constraint

Use local dummy JSON data as the temporary backend. Do not connect a real database, authentication service, SMS/email provider, payment gateway, shipping provider, or analytics platform unless a later explicit task authorizes it.

The prototype should be functional enough to demonstrate browsing, product details, cart, mock login, checkout, order placement, and order history. Clearly mark simulated operations in the code and UI where a user might otherwise assume a real transaction occurred.

## Existing project takes priority

Before changing files, inspect the existing repository:
- `package.json` and package manager
- Next.js, React, TypeScript and Tailwind versions
- `components.json` and existing shadcn/ui components
- current `AGENTS.md` and any `.agents/skills` instructions
- current route structure and styling tokens

Follow the version-specific Next.js documentation available in the installed package, especially if the project warns that APIs or conventions differ from standard examples. Preserve existing generated instructions in `AGENTS.md`; add custom instructions outside generated blocks rather than deleting or editing those blocks.

Use `pnpm` if the project already uses it. Do not replace the package manager or reinitialize the project. Do not overwrite existing configuration or remove existing working components without a clear reason.

## Technical direction

- Next.js App Router, using the conventions supported by the installed version.
- TypeScript with strict typing where the project supports it.
- Existing shadcn/ui and Radix components; do not rebuild equivalents unnecessarily.
- Existing Tailwind configuration and CSS design tokens; do not introduce a competing token system.
- Keep reusable UI components organized consistently with the existing project. Prefer feature-oriented modules for product, cart, auth, checkout, and orders.
- Use Server Components by default when suitable. Add Client Components only for interactions/state that need them.
- Keep mock data separate from UI components.
- Use typed data models and small utility functions.
- Keep business rules (price calculation, cart updates, stock checks, order creation) out of presentation components when practical.
- Avoid unnecessary dependencies. Explain why a dependency is needed before adding it.
- Maintain responsive layouts for mobile, tablet, and desktop.
- Preserve the existing RTL support. Do not break right-to-left layout or direction-aware spacing.
- Keep the existing light/dark theme behavior if already configured.

## Suggested prototype data approach

Use a clear location such as `src/data/` or the project's existing equivalent:
- `products.json`
- `categories.json`
- `banners.json`
- `mock-users.json` only if needed, with obviously fictional test accounts
- `mock-orders.json` only if static fixtures are useful

Create TypeScript types in the existing types location or near the feature. JSON should contain realistic but fictional product data. Do not use real customer personal information.

Suggested product fields:
- `id`, `slug`, `name`, `brand`, `categoryId`
- `description`, `shortDescription`
- `price`, `originalPrice`, `currency`
- `images` (local paths or stable placeholder image URLs already supported by the project)
- `rating`, `reviewCount`
- `stock`, `sku`
- `tags`, `isFeatured`, `isNew`
- optional product variants such as size or color only where appropriate

Use integer paise for INR calculations if prices are represented as numbers in business logic. For example, ₹499.00 should be represented internally as `49900` paise, or use a consistently documented rupee-based mock model and convert safely. Do not mix rupees and paise.

## Prototype behavior

- Browse products without signing in.
- Product listing supports basic search, category filtering, and sorting.
- Product detail pages show images, price, description, availability, and add-to-cart.
- Cart supports quantity changes, item removal, subtotal, and a clear empty state.
- Login supports selecting email or phone and entering a mock OTP. No real OTP is sent.
- Checkout supports a mock address form, order summary, simulated online-payment option, and Cash on Delivery.
- Online payment is a simulation only; never request or store card details.
- Order placement creates a local mock order and displays an order confirmation.
- Account/order pages should explain that data is temporary and may reset on refresh unless persistence is intentionally implemented for this prototype.
- If localStorage is used for demo cart/session/orders, isolate it behind client-side utilities, handle malformed stored data, and avoid reading `window` or localStorage during server rendering.
- Do not store sensitive information. Never persist OTPs or real payment details.

## UI direction

Create a modern, trustworthy Indian ecommerce experience:
- clear search, category navigation, account/cart entry points
- prominent hero/banner area
- product cards with consistent image ratios and price hierarchy
- visible original price/discount only when data supports it
- useful empty, loading, and error states
- checkout summary with transparent costs
- accessible keyboard focus, labels, and button states
- no fake scarcity claims, fake countdowns, or misleading trust/payment badges

Use original placeholder branding and copy. Avoid copying any competitor's exact interface or brand assets.

## Required workflow for every phase

1. Read this file and the relevant phase file.
2. Inspect the relevant existing code before editing.
3. Implement only the phase's scope; do not skip ahead.
4. Reuse existing components and conventions.
5. Run the relevant lint/typecheck/build scripts that exist in `package.json`. If a script is unavailable, say so; do not claim it passed.
6. Check for broken imports, TypeScript errors, hydration issues, and responsive layout problems.
7. Report:
   - summary of what was implemented
   - key files added/changed
   - commands/checks actually run and their results
   - known limitations
   - anything required before starting the next phase

Do not silently make major architecture changes. If a requirement conflicts with the existing project or the installed Next.js version, explain the conflict and recommend a minimal compatible approach.
