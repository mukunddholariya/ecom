# Local JSON Fixtures (Prototype Data Layer)

> [!NOTE]
> This folder contains temporary local dummy JSON data used for prototyping the ecommerce storefront.
> No real database, external authentication, payment gateway, SMS/email OTP, or inventory management system is connected.
> When moving to production, replace all functions in `lib/data.ts` with real server-side database queries (e.g., PostgreSQL, Prisma, Drizzle) and authenticated backend services.

## Files

1. **`products.json`**
   - 12 realistic dummy products spanning 5 distinct categories.
   - Includes IDs (`prod-01` to `prod-12`), unique slugs, descriptions, stock counts, SKUs, tags, and ratings.
   - Prices are integers representing Indian Rupees (INR) (e.g. `2999` = ₹2,999).
   - Some products include realistic variants (e.g. color hex codes or sizes).
   - Images use `https://placehold.co/...` placeholders configured in `next.config.ts`.

2. **`categories.json`**
   - 5 core product categories: Electronics, Fashion, Home & Kitchen, Beauty & Care, Sports & Fitness.
   - Includes category IDs (`cat-01` to `cat-05`), slugs, and Lucide icon mappings.

3. **`banners.json`**
   - 3 homepage marketing hero banners with CTAs, theme settings, and targeted category links.

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

