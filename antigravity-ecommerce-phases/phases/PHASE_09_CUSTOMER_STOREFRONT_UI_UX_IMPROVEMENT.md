# Phase 09 — Customer Storefront UI/UX Improvement

Read `MASTER_CONTEXT.md` and inspect the completed Phase 00–08 implementation before making changes.

## Goal

Improve only the customer-facing ecommerce storefront. Focus on visual consistency, usability, responsive behavior, product discovery, purchase confidence, and missing customer-facing states. The admin panel will be built and maintained in a separate repository, so do not create or modify admin/seller/dashboard features in this project.

**This phase is frontend-only. Continue using the existing local dummy JSON data and demo-only client state. Do not plan or implement backend migration.**

## Initial catalogue context — sexual protection / sexual wellness

The initial product range focuses on sexual protection products. Use a discreet, professional, inclusive and non-judgmental customer experience. Keep the underlying catalogue flexible for unrelated physical-product categories in the future.

- Use neutral, factual product presentation and appropriate product/package imagery. Do not introduce explicit imagery or a suggestive visual theme merely because of the category.
- Support product details that are relevant to actual catalogue data, such as pack quantity, brand, material, size/nominal width, lubrication, texture/flavour, compatibility, storage instructions, or expiry information. These are examples, not mandatory fields; render them only when supplied and relevant.
- Do not invent product specifications, medical advice, prevention/effectiveness claims, or compatibility claims. Never claim a product guarantees prevention of pregnancy or sexually transmitted infections. Prefer factual, manufacturer-provided content.
- Avoid promising discreet packaging, anonymous shipping, or confidential billing unless the business has verified those services. Any delivery/privacy message should be driven by truthful, configurable data rather than hardcoded marketing copy.
- Keep customer cart, account, and order information private within the limitations of the mock prototype; avoid unnecessary collection or logging of personal data. Make no claim that local client-side demo login provides real security.
- Do not hardcode the whole storefront to one product type. Dynamic attributes, variants, reusable product pages, filters, and homepage sections must support future categories.

## Non-negotiable constraints

- Scope is the customer-facing storefront only.
- Do not create admin, seller, staff, inventory-management, product-management, or operations dashboard routes/components in this repository.
- Do not connect a database, ORM, real API, real OTP provider, payment gateway, shipping provider, or other production service.
- Do not replace dummy JSON data with a backend.
- Do not delete or reinitialize the existing Next.js project.
- Preserve the installed Next.js conventions, shadcn/ui components, Radix, Tailwind setup, CSS variables, typography, theme support, and RTL support.
- Reuse existing components and state utilities. Do not create duplicate cart, session, product, or order state systems.
- Do not hardcode colors throughout components. Use existing CSS variables/design tokens. If the project already adopted the Deep Teal + Mango Orange palette, apply it consistently; otherwise inspect the current theme and propose any palette change before making a broad brand change.
- Do not copy Amazon, Flipkart, or Meesho branding, assets, or exact layouts. Use them only as broad ecommerce usability references.
- Avoid installing dependencies unless there is a clear, documented need.

## Part A — Audit the current customer frontend

Inspect the actual code and run relevant existing checks before modifying it.

Review these customer-facing journeys and screens:

- Homepage and storefront navigation
- Search, category filtering, sorting, and product listing
- Product detail page and variants, where present
- Cart and empty-cart state
- Login/email OTP demo and phone OTP demo
- Checkout, address form, simulated payment, and COD
- Order confirmation, customer account, addresses, and order history
- Responsive header/footer and reusable UI components

Identify issues such as inconsistent spacing, typography, button sizes, duplicate patterns, weak visual hierarchy, confusing navigation, missing empty/error states, awkward mobile layouts, dead controls, hydration/runtime warnings, and accessibility defects.

Before a broad redesign, form a short prioritized list of findings:

1. Must-fix usability problems
2. Visual consistency improvements
3. High-value customer-facing enhancements

Then proceed with minimal, high-impact changes. Do not stop after the audit unless a change would require a major architecture or visual-brand change. Explain any such blocker instead of making an unapproved broad change.

## Part B — Improve the storefront design system

- Make header, navigation, page widths, spacing, typography, borders, radii, shadows, and button variants consistent.
- Make primary, secondary, destructive, disabled, loading, focus, success, warning, and error states visually distinguishable.
- Keep product image ratios and product-card heights consistent across grids.
- Keep the interface clean and product-focused. Avoid saturating every section with brand colors.
- Preserve the useful light/dark theme behavior already supported by the project.
- Keep layouts responsive and direction-aware; preserve existing RTL behavior.
- Reuse shadcn/ui primitives and existing tokens instead of introducing parallel patterns.

## Part C — Improve key customer journeys

### Homepage and navigation

- Establish a clear hierarchy among header/search, category navigation, hero banner, featured collections, and product sections.
- Ensure hero content remains readable and usable on small screens.
- Use the current JSON banner/product data; do not duplicate fixtures inside JSX.
- Verify that visible links, category navigation, search submission, and CTAs navigate or act correctly.

### Product listing and product detail

- Improve product-card hierarchy for name, price, original price, discount, rating (only when fixture data supports it), and stock status.
- Improve search, filter, and sort controls for mobile and desktop.
- Provide clear no-results, missing-image, out-of-stock, and invalid-product states.
- Make purchase controls easy to find on small screens.
- Ensure selected variants are reflected in the UI and do not imply variant stock validation unsupported by mock data.
- Ensure category-related attributes are displayed only when relevant and available in the current data model.

### Cart and checkout

- Improve readability of quantity controls, line totals, subtotal, delivery/discount rows, and grand total.
- Keep checkout totals consistent with the existing shared calculation function.
- Make field labels, validation messages, disabled/loading states, and payment-method selection clear.
- Clearly label online payment and OTP journeys as simulations. Never imply that real payment was processed or a real OTP was delivered.
- Preserve the cart after simulated payment failure.
- Ensure the user can recover from errors without losing entered information unnecessarily.

### Account and order pages

- Improve empty states, order status labels, item summaries, and responsive order details.
- Keep mock orders based on their saved item/price snapshots rather than current product fixture values.
- Keep logout and demo-session UI consistent across the header and account pages.
- Ensure address forms provide clear validation and understandable success/error feedback.

## Part D — Make the customer storefront catalog flexible for future product categories

Implement these requirements in the storefront using the existing local JSON fixtures. The business may initially sell a narrow product range and add different physical-product categories later, so do not hardcode the UI around a single category or fixed set of attributes.

### Dynamic product attributes

- Support optional, category-specific attributes in the product data model. Examples include size, color, dimensions, material, compatibility, model number, and technical specifications; for relevant sexual protection products, examples may include pack quantity, confirmed material, size/nominal width, lubrication, compatibility, storage, and expiry details when actually provided by the product data.
- Use a consistent, typed attribute structure with a stable key, customer-facing label, value, and optional unit/group where useful. Avoid unsafe assumptions that every category has the same fields.
- Render only attributes that exist and have meaningful values. Do not display empty labels or invent specifications.
- Where appropriate, use relevant attributes for product filters and product-detail specifications without showing irrelevant filters for unrelated categories.

### Reusable product detail page

- Keep one reusable product detail page structure for the catalogue rather than creating a separate hardcoded page for every category.
- Display common information consistently (images, name, price, availability, description, purchase controls), then render optional attribute/specification, warranty, compatibility, care, or delivery sections only when the data exists.
- Keep category-specific sections modular so future categories can add information without duplicating the entire page.

### Product variants and variant-level pricing/stock

- Support optional variants such as size/color combinations, package sizes, models, or other category-specific options.
- Each variant should have a stable ID and, when applicable, its own SKU, option values, price, compare-at/original price, stock quantity, and image override.
- Resolve the selected variant consistently across product detail, cart, and checkout. The cart should identify a variant as well as the parent product when variants are used.
- Validate the selected variant's availability and quantity using the current local catalogue data. Do not rely on a stale price or stock value saved in browser storage.
- Use shared mock-data lookup and pricing/inventory calculation helpers as the single source of truth across the frontend. Keep this logic behind a data/service interface so a future backend can replace the implementation without rewriting UI components.
- **Prototype limitation:** all price and inventory checks in this phase still run against local dummy JSON and client-side demo logic. Do not claim this is secure server-side validation and do not add a backend in this phase.
- For products without variants, preserve the existing single-product price and stock behavior.

### Configurable homepage content (storefront only)

- Drive the homepage's banners, featured categories, product collections, and section order from typed local JSON/configuration data instead of duplicating content in JSX.
- Allow sections to be enabled/disabled and configured with a section type, title, optional subtitle, display order, and relevant product/category IDs when useful.
- Keep the storefront responsible only for rendering this configuration. **Do not create an admin/editor interface in this repository**; the admin panel belongs in a separate project.
- Use sensible fallbacks for missing references or empty sections, and avoid rendering broken/empty homepage sections.

### SEO-ready product pages

- Keep product URLs stable and slug-based, following the existing route convention.
- Add product-specific page title, meta description, canonical URL when supported by the existing app setup, and Open Graph/social metadata using available product data.
- Provide meaningful image alt text from data where possible; use appropriate fallback text without keyword stuffing.
- Add Product structured data only when all required values are supported by actual fixture data and the format is appropriate for the installed Next.js version. Do not fabricate ratings, reviews, availability, price, medical/safety/effectiveness claims, or seller claims to populate structured data.
- Ensure invalid product slugs use the existing Next.js not-found convention and avoid duplicate or contradictory metadata.
- Follow the Next.js documentation installed in the project before using version-specific metadata or structured-data conventions.

## Part E — Prioritized customer-facing enhancements

First review whether any of these features already exist. Do not duplicate them. Add only a small, high-value set that fits the existing prototype:

- Wishlist/favourites using demo-only state
- Recently viewed products
- Mock coupon entry and validation against explicit local fixtures
- Pincode serviceability checker using clearly labelled sample results
- Related or compatible product recommendations based on available JSON fields
- Better delivery/returns/warranty information blocks where relevant to the product data

Do not add every enhancement automatically. Prefer improving existing journeys over increasing feature count. Document optional ideas deferred to a later phase.

## Part F — Accessibility and responsive QA

Test small mobile, tablet, and desktop layouts for the key customer-facing routes.

Check:

- No unintended horizontal overflow
- Search/navigation/product grids remain usable at narrow widths
- Visible keyboard focus and logical tab order
- Semantic headings and landmarks
- Form labels and associated validation messages
- Accessible names for icon-only buttons
- Adequate contrast for text and controls in light and dark themes
- Useful image alt text or decorative-image handling
- Errors, stock, and order statuses are not conveyed by color alone
- No browser-only APIs are accessed during server rendering
- No avoidable hydration mismatches
- No dead links or inert controls in areas changed

## Acceptance checklist

- Only customer-facing storefront routes/components are added or modified.
- No admin/seller/dashboard functionality is created in this repository.
- Existing customer routes continue to work.
- Storefront visuals are consistent with the current token system.
- Search, listing, product details, cart, checkout, account, and mock orders still behave correctly.
- Product attributes can vary by category and are rendered only when relevant data exists.
- Product detail pages use a reusable core layout with optional data-driven sections.
- Variant-aware products keep selected variant, price, and stock consistent across product detail, cart, and checkout; non-variant products still work.
- Shared local-data helpers centralize frontend price and stock calculations; no UI component trusts a price stored only in browser state.
- Homepage banners, categories, and product sections are rendered from local configuration data, with no admin/editor UI added.
- Product pages have appropriate data-driven metadata, descriptive image alt text, and structured data only when supported by reliable fixture fields.
- Mock OTP and payment flows are clearly labelled as simulations.
- Responsive layouts and key accessibility behaviors have been checked.
- Existing lint/typecheck/build scripts pass where available; report accurately if a script is unavailable or a check fails.
- No database, backend, or real service integration is added.

## Out of scope

Do not create or update `BACKEND_MIGRATION_PLAN.md`. Do not select/configure a database, ORM, real auth provider, payment gateway, shipping integration, production API, deployment infrastructure, or admin panel. The admin panel belongs to a separate repository and is explicitly outside the scope of this phase.

## Final report

Report:

1. Main problems found and fixed
2. Storefront screens improved
3. Customer-facing enhancements implemented and deferred
4. Files added/changed
5. Commands/checks actually run and their results
6. Known demo-only limitations
7. Any remaining frontend UX work recommended for a later phase

Stop after this frontend improvement phase. Do not proceed to backend planning or integration automatically.
