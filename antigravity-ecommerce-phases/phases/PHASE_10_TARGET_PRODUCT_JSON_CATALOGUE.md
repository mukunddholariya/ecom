# Phase 10 — Update Dummy JSON Catalogue for Sexual Protection Products

Read `MASTER_CONTEXT.md` and review the completed Phase 00–09 work before making changes. This phase comes after the storefront UI/UX phase and focuses on catalogue data first.

## Goal

Replace unrelated generic sample products in the existing local JSON fixtures with a coherent, clearly demo-only catalogue for the business's current target: **sexual protection products**. Keep the data model flexible enough to support other physical-product categories in the future.

This phase is about the dummy data layer and the minimum type/data-access updates needed to support it. Do not redesign the storefront or start backend work.

## Non-negotiable scope

- Continue using the project's existing local JSON/mock data. Do not connect a database, ORM, server API, product supplier API, authentication provider, payment gateway, or other production service.
- Do not create an admin panel. The admin panel belongs in a separate repository.
- Do not make a broad UI redesign. Only make small compatibility updates required for the existing UI to read the revised JSON safely.
- Do not change the brand identity, color palette, typography, layout, routes, checkout flow, or overall component architecture in this phase.
- Inspect the actual project and its current JSON/types first. Do not assume file names or schemas from this prompt if the repository differs.
- Preserve working cart, variant, product detail, search, filter, and checkout flows.

## Step 1 — Audit existing mock data and its consumers

1. Find the current product, category, banner, and homepage configuration JSON files, wherever they are located.
2. Find the corresponding TypeScript types/interfaces and data-access helpers.
3. Find every place that reads or displays product data: homepage sections, product cards, listing/search/filter/sort, product details, variants, cart, checkout, and mock order creation.
4. Record the current schema and identify fields that are mandatory for rendering or calculations.
5. Inspect Phase 09 requirements and preserve dynamic attributes, reusable product details, variant-aware prices/stock, data-driven homepage sections, and SEO-ready product metadata already implemented.
6. Before editing, report the files found and any schema mismatch that might affect existing pages. Then proceed with the minimal required changes; do not stop at the audit unless the repository has a serious conflict that needs a decision.

## Step 2 — Update the category fixtures

Create a small, coherent set of categories focused on sexual protection. Prioritize the actual target product type and do not introduce unrelated products. Only include adjacent categories such as lubricants or other sexual wellness products if they are within the intended initial range or already represented by the project's requirements.

Suggested category fields, adapted to the existing schema:
- stable `id` and URL-safe `slug`
- customer-facing `name` and short factual `description`
- optional image path if a valid asset already exists
- optional `parentId` for future subcategories
- `isActive` or equivalent if the current schema supports visibility
- optional `sortOrder`

Use respectful, neutral, inclusive language. Do not use explicit or suggestive category artwork. Do not promise privacy, discreet packing, anonymous shipping, or medical outcomes.

## Step 3 — Replace generic product fixtures with target-focused demo products

Update the existing `products.json` or equivalent to contain approximately 8–12 coherent demo products, unless the existing project has a different deliberate catalogue size. The set should be varied enough to exercise category navigation, search, filters, sorting, product detail pages, cart, and checkout.

### Product-data rules

- Use fictional placeholder product/brand names or generic demo names; do not impersonate real brands or imply authorization to sell a brand.
- Treat all invented names, prices, stock counts, SKUs, and commercial details as prototype fixtures, not real selling information. Add a clearly named field such as `demoOnly: true` only if it fits the current model safely, and document the demo-only status in code/readme. Do not expose a fake review count or rating as real social proof.
- Do not fabricate manufacturer specifications or medical claims. If actual product specifications are not supplied, omit the field or use an explicit non-displayable placeholder only in developer fixtures. Never show text such as `TBD`, `unknown`, or invented specs as if they were actual product facts to shoppers.
- Do not claim a product prevents pregnancy or sexually transmitted infections with 100% certainty or makes any guarantee. Do not make unsupported effectiveness, safety, medical, compatibility, or quality claims.
- Do not invent storage instructions, expiry dates, warnings, certifications, regulatory approval, material, nominal width/size, lubrication type, flavour, texture, or compatibility. Include these only as explicit demo data for layout testing and keep them clearly marked as synthetic; otherwise omit them. Before launch, the business must replace them with verified supplier/manufacturer data.
- Do not hardcode user-facing copy that claims discreet packaging, confidential billing, neutral packaging, or anonymous delivery unless confirmed by the business.
- Use valid image paths that exist in the project or existing known-safe placeholders/fallbacks. Never invent local paths that do not exist. Do not download or add new images in this phase unless specifically approved.

### Core fields

Preserve the existing fields required by current code, and make sure the data model can express these where applicable:
- `id`, `slug`, `name`, `brand`, `categoryId`
- `shortDescription`, `description`
- `price`, optional `originalPrice`, `currency`
- `images` and meaningful alt text where supported
- `sku`, availability/stock
- `tags`, `isFeatured`, `isNew`
- optional `attributes` for category-specific information
- optional `variants` for variant-specific SKU, price, stock, and image override

Use the project's current money convention consistently. If the code uses integer paise, every price used in business logic must be in paise. If it uses rupee-denominated fixture values, document the convention and ensure all totals use that same convention. Never mix paise and rupees.

## Step 4 — Dynamic attributes and variant test coverage

Keep the catalogue generic; do not turn the product interface into a condom-only schema.

### Optional attributes

Use the existing attribute shape when one exists. Otherwise, add a small typed, backward-compatible shape such as:

```ts
type ProductAttribute = {
  key: string;
  label: string;
  value: string | number | boolean;
  unit?: string;
  group?: string;
};
```

Do not add all possible attributes to all products. Product detail pages must render only attributes with real, non-empty values. Keep sensitive or medically significant claims out unless backed by verified product information.

### Variants

- Include at least one fixture with multiple variants if the current implementation supports variants; otherwise document the smallest compatibility change required rather than rebuilding the variant feature here.
- Each variant should have a stable ID and optional variant-specific SKU, price, original price, stock, option values, and image override.
- Ensure variant IDs and option combinations are unique within a product.
- Ensure cart lines and totals continue to identify the selected variant where variants are supported.
- Validate that variant stock does not exceed what the mock data says is available. Do not silently use parent product stock when a selected variant has its own stock.

## Step 5 — Update related JSON fixtures

### Banners and homepage sections

- Update existing banners and homepage configuration so copy and categories match the sexual protection catalogue.
- If the homepage already reads from banner/section JSON, update those fixtures instead of hardcoding new page content.
- Keep text respectful, clear, non-judgmental, and suitable for a mainstream ecommerce store.
- Do not add claims about guaranteed protection, privacy, or shipping without verified facts.
- Use only existing, valid image paths or supported fallbacks.

### Optional mock orders

If existing mock orders reference product IDs that will be removed, update them to reference valid product/variant IDs or preserve a deliberate historical snapshot with an explanatory fixture comment. Do not allow broken references to crash order history.

### Search/filter fixture support

Ensure the current fixtures provide enough meaningful tags/categories/attributes to test the existing search, category filter, sort, featured collection, stock status, and variant selection. Do not add filters that the UI cannot support, and do not expose a medically sensitive or unsupported filter.

## Step 6 — Data integrity checks

Create or run a small validation helper/test if it fits the project conventions. At minimum verify:

- Every product ID and slug is unique.
- Every `categoryId` references an existing category.
- Every banner and homepage section product/category reference resolves.
- Every variant ID is unique within its product and every variant has a stable option combination.
- Prices are non-negative and use one documented money convention.
- Original/compare-at price is present only when it is greater than the sale price.
- Stock values are non-negative integers.
- Each image path is valid or has a working fallback.
- Attribute keys are stable; attributes rendered to the user have non-empty values.
- Mock orders do not crash if a catalogue item was renamed or removed; preserve order snapshots when the existing data model supports them.
- Rating/review fields are omitted or zero/hidden unless they are intentionally synthetic and clearly not presented as real social proof.

## Acceptance criteria

- The product catalogue is now targeted at sexual protection rather than unrelated generic products.
- Product/category/banner fixtures remain fictional demo data and are not confused with verified supplier data.
- Current storefront routes continue to render from JSON.
- Product listing, search, category filters, sorting, product details, variants, cart, checkout, and order pages still work with the new IDs/schema.
- Dynamic attributes are optional and future-category-friendly.
- No UI redesign, admin panel, backend integration, production API, or real service was added.
- Existing lint/typecheck/build commands pass where available, or failures are reported accurately.

## Final report required

After implementation, summarize:
1. JSON files and types changed.
2. Categories and number of products/variants added.
3. Product attributes intentionally omitted because verified product data was not supplied.
4. Image paths reused and fallbacks used.
5. Data integrity checks and commands actually run.
6. Any UI consumer that could not be updated safely.
7. Exact fields the business must provide later to replace the demo fixtures with genuine product data.

Do not start a new phase, add a database, redesign the storefront, or implement the admin repository in this task.
