# Phase 02 — Ecommerce Home Page

Read `MASTER_CONTEXT.md` and inspect the existing layout/components before coding.

## Goal

Build the responsive storefront home page using the local JSON data and the existing design system.

## Required content

1. Header:
   - original placeholder brand/logo text
   - search input
   - account/login entry
   - cart entry with item count when cart state is available
   - responsive mobile navigation
2. Category navigation appropriate for the current catalogue.
3. Hero/banner section driven by `banners.json`; do not hardcode duplicate banner data inside the page.
4. Featured products section using product data.
5. Category or collection sections if they add value for the current number of products.
6. A simple benefits/service strip only if it can be written honestly without fake claims.
7. Footer with useful placeholder links and contact information clearly marked as demo content where needed.

## Interaction requirements

- Search should submit or navigate to the product listing page with a query parameter, using the existing router conventions.
- Category links should navigate to the relevant listing/filter state.
- Product cards should link to the correct product slug.
- Cart/account controls should link to the corresponding routes.
- Use existing cart state if already implemented; if not, show a neutral cart icon/count placeholder without building the cart feature ahead of schedule.
- Banner controls must work if carousel arrows/dots are shown. Prefer a simple accessible implementation over a heavy carousel dependency.

## Visual requirements

- Modern Indian ecommerce storefront, inspired by common shopping patterns rather than copied competitor layouts.
- Clear spacing, readable typography, consistent image ratios, and a strong mobile experience.
- Use existing Tailwind tokens and shadcn components.
- Keep RTL and theme behavior intact.
- Avoid excessive gradients, fake badges, fake countdowns, or fabricated reviews.
- Add proper heading hierarchy, image alt text, keyboard focus states, and accessible control labels.

## Acceptance checklist

- Homepage renders from local data.
- No product/banner data is duplicated unnecessarily in JSX.
- Product cards and navigation links resolve correctly.
- Search works as described.
- Mobile, tablet, and desktop layouts are usable.
- Empty/missing image fallback is handled.
- No real backend integration is introduced.

## Final report

Summarize the home page, routes linked, components reused/created, and checks actually run.
