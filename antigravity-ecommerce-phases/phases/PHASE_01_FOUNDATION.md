# Phase 01 — Foundation, Types, and Dummy JSON Data

Read `MASTER_CONTEXT.md` first. Confirm Phase 00 findings before coding.

## Goal

Prepare a reliable foundation for the storefront and create fictional local JSON fixtures. Do not build full page designs yet.

## Tasks

1. Follow the existing repository conventions and create only the folders that are actually needed.
2. Add typed models for Product, Category, Banner, CartItem, Address, MockUser, and MockOrder where appropriate.
3. Create local fictional JSON data for:
   - 8–12 products across 3–5 categories
   - 2–4 homepage banners
   - category navigation data
   - optional mock orders for account-page development
4. Use consistent product IDs and slugs. Ensure every product category exists and all image fields are usable.
5. Product data should include price, optional original price, stock, SKU, images, description, rating/review count, tags, featured/new flags, and optional variants where sensible.
6. Use a consistent INR representation. Prefer integer paise in business logic and clearly document the convention. Do not mix paise and rupees.
7. Add typed data-access functions such as `getProducts`, `getProductBySlug`, `getCategories`, `getBanners`, and `getFeaturedProducts`. Keep the functions simple and deterministic.
8. Add safe helpers for formatting INR and calculating discount percentage only when meaningful.
9. Add shared product-related UI primitives only if they are needed now and fit the existing component system. Avoid creating a large generic component library prematurely.
10. Preserve current shadcn components, theme, tokens, fonts, and RTL behavior.
11. If no reliable product images are available, use consistent neutral placeholders or existing project assets. Do not invent local image paths that do not exist.
12. Add a brief note documenting that JSON is the temporary data source and must later be replaced by server-side database access.

## Acceptance checklist

- TypeScript models match the JSON shape.
- Every product has a unique ID and slug.
- Every category reference is valid.
- All image paths/URLs are valid or deliberately rendered as fallbacks.
- INR formatting and discount calculations handle missing/invalid values.
- No real services or secrets are added.
- Existing lint/typecheck scripts pass, if available.

## Out of scope

Do not implement full homepage, product listing, cart, login, checkout, database, or real integrations in this phase.

## Final report

List files created/changed, sample data counts, checks actually run, and any data assumptions.
