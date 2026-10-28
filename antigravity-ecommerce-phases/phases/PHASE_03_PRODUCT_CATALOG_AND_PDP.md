# Phase 03 — Product Listing, Search, Filters, and Product Details

Read `MASTER_CONTEXT.md` first.

## Goal

Implement a usable product catalogue and product detail page using the local JSON fixtures.

## Routes

Adapt to the existing route structure, but support equivalents of:
- `/products`
- `/products/[slug]`

## Product listing requirements

- Display product cards from the local data-access layer.
- Search by product name, brand, tags, and relevant description fields.
- Category filtering via query string or route state.
- Sorting options: featured/default, price low-to-high, price high-to-low, and newest if supported by data.
- Show a result count.
- Keep filter/search state coherent when navigating or refreshing.
- Provide clear empty results and reset-filter behavior.
- Do not add complex pagination for a catalogue of 8–50 products unless the current project already requires it.

## Product detail page requirements

- Resolve product using the route slug.
- Show product name, image gallery, price, original price only when valid, discount only when meaningful, description, availability, SKU if useful, and variants if supplied.
- Quantity selector must enforce a minimum of 1 and not exceed available stock.
- Add-to-cart button should connect to a clean callback/interface; use the actual cart implementation only if Phase 04 is complete. Otherwise provide a clearly temporary interface and do not create a second cart state system.
- Show a not-found UI for invalid slugs using the installed Next.js version's conventions.
- Add breadcrumb/navigation back to the catalogue.
- On mobile, ensure the purchase controls and price are easy to find.

## Data and quality

- Use typed data-access functions from Phase 01.
- Avoid reading raw JSON directly inside multiple components.
- Use semantic controls and accessible labels.
- Do not invent product specifications that are not in the fixture data.
- Use image fallbacks for missing images.
- Keep price formatting consistent.

## Acceptance checklist

- Listing, search, category filtering, and sorting work together.
- Product links resolve to the correct details page.
- Invalid slug shows a proper not-found state.
- Quantity cannot be zero, negative, or above stock.
- No database or external commerce API is introduced.
- Responsive and keyboard-accessible behavior is checked.

## Final report

Describe routes, interactions, state/query-string strategy, files changed, and checks actually run.
