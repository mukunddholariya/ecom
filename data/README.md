# Local JSON Fixtures (Prototype Data Layer)

> [!NOTE]
> This folder contains temporary local dummy JSON data used for prototyping the ecommerce storefront.
> No real database, external authentication, payment gateway, SMS/email OTP, or inventory management system is connected.
> When moving to production, replace all functions in `lib/data.ts` with real server-side database queries (e.g., PostgreSQL, Prisma, Drizzle) and authenticated backend services.

## Files

1. **`products.json`**
   - 10 targeted fictional dummy products for sexual protection and intimate wellness across 5 categories.
   - Includes IDs (`prod-01` to `prod-10`), unique slugs, neutral descriptions, stock counts, SKUs, tags, and synthetic demo reviews.
   - All items are marked with `demoOnly: true`. Specifications, dimensions, and materials are synthetic developer fixtures for layout testing and must be replaced with verified manufacturer data before commercial launch.
   - Prices are integers representing Indian Rupees (INR) (e.g. `349` = ₹349).
   - Several products include pack-size or volume variants (`Pack of 10`, `Pack of 20`, `100ml`, `200ml`).
   - Images use local project fallbacks (`/images/placeholder.svg`).

2. **`categories.json`**
   - 5 target categories: Ultra Thin (`cat-01`), Textured & Ribbed (`cat-02`), Flavoured (`cat-03`), Latex-Free (`cat-04`), Lubricants & Gels (`cat-05`).
   - Includes category IDs (`cat-01` to `cat-05`), slugs, and Lucide icon mappings (`shield`, `sparkles`, `heart`, `leaf`, `droplets`).

3. **`banners.json`**
   - 3 homepage hero banners with respectful, mainstream intimate protection and wellness CTAs, theme settings, and category links.

4. **`mock-users.json`**
   - 2 fictional demo test users (`user-01`, `user-02`).
   - Phone numbers and emails are fictional test data.
   - Mock OTP is always `123456` for simulated authentication during the prototype.

5. **`mock-orders.json`**
   - 3 realistic mock orders linked to demo users.
   - Provides sample order statuses (`delivered`, `shipped`, `confirmed`), items, addresses, and payment methods for account and order tracking development.

## Currency & Calculation Rules

- **Currency**: INR (`₹`).
- **Storage**: Rupee integers (e.g. `499`).
- **Formatting**: Handled via `formatPrice(rupees)` in `lib/format.ts` which uses `en-IN` locale.
- **Precision**: Conversions to/from paise are provided via `rupeesToPaise` and `paiseToRupees` in `lib/format.ts`. Never mix rupees and paise in calculations.

