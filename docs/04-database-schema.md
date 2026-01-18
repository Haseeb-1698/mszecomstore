# Database Schema

This document details the complete database structure used in MSZ Ecom Store, powered by Supabase (PostgreSQL).

## Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐
│   auth.users     │       │  user_profiles   │
│ (Supabase Auth)  │       │                  │
├──────────────────┤       ├──────────────────┤
│ id (UUID) PK     │◄──────│ id (UUID) PK/FK  │
│ email            │       │ full_name        │
│ created_at       │       │ email            │
│ ...              │       │ phone            │
└──────────────────┘       │ whatsapp         │
         │                 │ avatar_url       │
         │                 │ role             │
         │                 │ created_at       │
         │                 │ updated_at       │
         │                 └──────────────────┘
         │
         │
         ▼
┌──────────────────┐       ┌──────────────────┐
│     orders       │       │   order_items    │
├──────────────────┤       ├──────────────────┤
│ id (UUID) PK     │◄──────│ id (UUID) PK     │
│ user_id (FK)     │       │ order_id (FK)    │
│ plan_id (FK)     │       │ plan_id (FK)     │
│ amount           │       │ service_name     │
│ status           │       │ plan_name        │
│ customer_name    │       │ duration_months  │
│ customer_email   │       │ price            │
│ customer_whatsapp│       │ quantity         │
│ special_instruct │       │ created_at       │
│ created_at       │       └──────────────────┘
│ updated_at       │
│ delivered_at     │
└──────────────────┘
         │
         │
         ▼
┌──────────────────┐       ┌──────────────────┐
│     plans        │       │    services      │
├──────────────────┤       ├──────────────────┤
│ id (UUID) PK     │──────►│ id (UUID) PK     │
│ service_id (FK)  │       │ name             │
│ name             │       │ slug             │
│ type             │       │ category         │
│ tier             │       │ description      │
│ duration_months  │       │ long_description │
│ price            │       │ icon_url         │
│ original_price   │       │ badge            │
│ savings          │       │ display_order    │
│ features (JSONB) │       │ is_active        │
│ is_popular       │       │ created_at       │
│ display_order    │       │ updated_at       │
│ is_available     │       └──────────────────┘
│ created_at       │
│ updated_at       │
└──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│     carts        │       │   cart_items     │
├──────────────────┤       ├──────────────────┤
│ id (UUID) PK     │◄──────│ id (UUID) PK     │
│ user_id (FK)     │       │ cart_id (FK)     │
│ discount         │       │ plan_id (FK)     │
│ discount_code    │       │ service_name     │
│ created_at       │       │ plan_name        │
│ updated_at       │       │ price            │
└──────────────────┘       │ quantity         │
                           │ created_at       │
                           │ updated_at       │
                           └──────────────────┘
```

## Tables in Detail

### `user_profiles`

Extends Supabase Auth with application-specific user data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, FK to auth.users | Links to Supabase Auth |
| `full_name` | TEXT | nullable | User's display name |
| `email` | TEXT | nullable | Denormalized from auth |
| `phone` | TEXT | nullable | Phone number |
| `whatsapp` | TEXT | nullable | WhatsApp contact |
| `avatar_url` | TEXT | nullable | Profile picture URL |
| `role` | TEXT | NOT NULL, default 'customer' | 'customer' or 'admin' |
| `created_at` | TIMESTAMPTZ | default NOW() | When profile created |
| `updated_at` | TIMESTAMPTZ | default NOW() | Last update time |

**Notes:**
- Created automatically when user signs up (via database trigger or application logic)
- `role` controls access to admin features
- `email` is duplicated from auth for easier querying

### `services`

Digital subscription products available for purchase.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, default gen_random_uuid() | Unique identifier |
| `name` | TEXT | NOT NULL | Service name (e.g., "Netflix") |
| `slug` | TEXT | UNIQUE | URL-friendly name |
| `category` | TEXT | NOT NULL | Category (streaming, vpn, etc.) |
| `description` | TEXT | nullable | Short description |
| `long_description` | TEXT | nullable | Detailed description |
| `icon_url` | TEXT | nullable | Service logo URL |
| `badge` | TEXT | nullable | 'popular' or 'best_value' |
| `display_order` | INTEGER | default 0 | Sort order |
| `is_active` | BOOLEAN | default true | Show/hide service |
| `created_at` | TIMESTAMPTZ | default NOW() | Creation time |
| `updated_at` | TIMESTAMPTZ | default NOW() | Last update |

**Categories (enum values):**
- `streaming` - Video services (Netflix, Prime)
- `professional` - Work tools (Adobe, Office)
- `vpn` - VPN services
- `gaming` - Gaming subscriptions
- `education` - Learning platforms
- `music` - Audio streaming
- `productivity` - Productivity apps
- `other` - Miscellaneous

### `plans`

Pricing tiers for each service.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `service_id` | UUID | FK to services, NOT NULL | Parent service |
| `name` | TEXT | NOT NULL | Plan name |
| `type` | TEXT | CHECK (shared/dedicated) | Access type |
| `tier` | TEXT | CHECK (basic/standard/premium) | Tier level |
| `duration_months` | INTEGER | NOT NULL | Subscription length |
| `price` | DECIMAL(10,2) | NOT NULL | Current price |
| `original_price` | DECIMAL(10,2) | nullable | Price before discount |
| `savings` | DECIMAL(10,2) | nullable | Amount saved |
| `features` | JSONB | default '[]' | Feature list as JSON array |
| `is_popular` | BOOLEAN | default false | Highlight as popular |
| `display_order` | INTEGER | default 0 | Sort order within service |
| `is_available` | BOOLEAN | default true | Can be purchased |
| `created_at` | TIMESTAMPTZ | default NOW() | Creation time |
| `updated_at` | TIMESTAMPTZ | default NOW() | Last update |

**Example `features` JSON:**
```json
["4K Ultra HD", "Watch on 4 screens", "Downloads available", "Ad-free streaming"]
```

### `orders`

Customer purchase records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `user_id` | UUID | FK to auth.users, NOT NULL | Customer |
| `plan_id` | UUID | FK to plans, NOT NULL | Primary plan ordered |
| `amount` | DECIMAL(10,2) | NOT NULL | Total order amount |
| `status` | order_status | default 'pending' | Order status |
| `customer_name` | TEXT | nullable | Customer's name |
| `customer_email` | TEXT | nullable | Contact email |
| `customer_whatsapp` | TEXT | nullable | WhatsApp contact |
| `special_instructions` | TEXT | nullable | Order notes |
| `created_at` | TIMESTAMPTZ | default NOW() | Order placed time |
| `updated_at` | TIMESTAMPTZ | default NOW() | Last status update |
| `delivered_at` | TIMESTAMPTZ | nullable | Delivery completion |

**Order Status (enum):**
- `pending` - Order placed, awaiting processing
- `processing` - Being prepared
- `completed` - Ready for delivery
- `cancelled` - Order cancelled
- `delivered` - Delivered to customer

### `order_items`

Individual items within an order (supports multi-item orders).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `order_id` | UUID | FK to orders, NOT NULL | Parent order |
| `plan_id` | UUID | FK to plans, NOT NULL | Plan purchased |
| `service_name` | TEXT | NOT NULL | Denormalized service name |
| `plan_name` | TEXT | NOT NULL | Denormalized plan name |
| `duration_months` | INTEGER | NOT NULL | Duration at purchase |
| `price` | DECIMAL(10,2) | NOT NULL | Price at purchase |
| `quantity` | INTEGER | NOT NULL, default 1 | Number of subscriptions |
| `created_at` | TIMESTAMPTZ | default NOW() | Creation time |

**Note:** Service/plan names are denormalized to preserve order history even if services change.

### `carts`

Shopping cart header (one per user).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `user_id` | UUID | FK to auth.users, UNIQUE | Cart owner |
| `discount` | DECIMAL(10,2) | default 0 | Applied discount |
| `discount_code` | TEXT | nullable | Discount code used |
| `created_at` | TIMESTAMPTZ | default NOW() | Cart creation |
| `updated_at` | TIMESTAMPTZ | default NOW() | Last modification |

**Note:** `user_id` is UNIQUE - each user has exactly one cart.

### `cart_items`

Items in shopping cart.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `cart_id` | UUID | FK to carts, NOT NULL | Parent cart |
| `plan_id` | UUID | FK to plans, NOT NULL | Plan in cart |
| `service_name` | TEXT | NOT NULL | Service display name |
| `plan_name` | TEXT | NOT NULL | Plan display name |
| `price` | DECIMAL(10,2) | NOT NULL | Item price |
| `quantity` | INTEGER | NOT NULL, default 1 | Quantity |
| `created_at` | TIMESTAMPTZ | default NOW() | Added time |
| `updated_at` | TIMESTAMPTZ | default NOW() | Last update |

**Constraint:** `UNIQUE(cart_id, plan_id)` - Prevents duplicate items; update quantity instead.

### `subscriptions` (Legacy/Future)

Tracks active subscriptions (partially implemented).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `user_id` | UUID | FK to auth.users | Subscriber |
| `plan_id` | UUID | FK to plans | Subscribed plan |
| `credentials` | JSONB | nullable | Access credentials |
| `status` | TEXT | CHECK | active/expired/cancelled |
| `started_at` | TIMESTAMPTZ | default NOW() | Start date |
| `expires_at` | TIMESTAMPTZ | NOT NULL | Expiration date |
| `created_at` | TIMESTAMPTZ | default NOW() | Creation time |

## Custom Types (Enums)

```sql
-- Order status
CREATE TYPE order_status AS ENUM (
  'pending', 'processing', 'completed', 'cancelled', 'delivered'
);

-- Plan type
CREATE TYPE plan_type AS ENUM ('shared', 'dedicated');

-- Service category
CREATE TYPE service_category AS ENUM (
  'streaming', 'professional', 'vpn', 'gaming', 
  'education', 'music', 'productivity', 'other'
);

-- User role
CREATE TYPE user_role AS ENUM ('customer', 'admin');
```

## Indexes

Performance indexes created for common queries:

```sql
-- User lookups
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Service lookups
CREATE UNIQUE INDEX idx_services_slug ON services(slug);

-- Plan lookups
CREATE INDEX idx_plans_service_id ON plans(service_id);

-- Order queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Cart queries
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_plan_id ON cart_items(plan_id);
```

## Database Functions

### `get_admin_dashboard_stats()`

Returns aggregated statistics for admin dashboard.

```sql
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
  total_revenue DECIMAL,
  pending_orders INTEGER,
  active_customers INTEGER,
  delivered_today INTEGER
) AS $$
BEGIN
  RETURN QUERY SELECT
    COALESCE(SUM(amount), 0)::DECIMAL as total_revenue,
    COUNT(*) FILTER (WHERE status = 'pending')::INTEGER as pending_orders,
    COUNT(DISTINCT user_id)::INTEGER as active_customers,
    COUNT(*) FILTER (WHERE delivered_at::DATE = CURRENT_DATE)::INTEGER as delivered_today
  FROM orders;
END;
$$ LANGUAGE plpgsql;
```

## Row Level Security (RLS)

Currently **disabled** for simplicity (per migration `20260113220141_disabling_RLS.sql`).

If enabled, policies would be:

```sql
-- Services: Public read
CREATE POLICY "Public can view active services" ON services
  FOR SELECT USING (is_active = true);

-- Orders: Users see only their own
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Carts: Users access only their own
CREATE POLICY "Users can access own cart" ON carts
  FOR ALL USING (auth.uid() = user_id);
```

## TypeScript Types

The types in `src/lib/database.types.ts` mirror the database schema:

```typescript
// Example type definitions
export type PlanType = 'shared' | 'dedicated';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'delivered';
export type UserRole = 'customer' | 'admin';

export interface DbService {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  // ... etc
}
```

## Migration History

Migrations are in `supabase/migrations/` and run in timestamp order:

1. `20260113081913_initial_schema.sql` - Base tables
2. `20260113220141_disabling_RLS.sql` - Disable RLS
3. `20260113230000_schema_improvements.sql` - Add user_profiles, enums
4. `20260114000000_plan_structure_improvements.sql` - Add tiers, views
5. `20260114100000_dummy_data.sql` - Test data
6. `20260114120000_remove_payment_system.sql` - Remove unused payment tables
7. `20260114140000_add_carts_table.sql` - Shopping cart tables
8. `20260114150000_fix_admin_dashboard_stats.sql` - Fix stats function
9. `20260114172039_emergency-fix.sql` - Bug fixes
10. `20260114180000_role_based_signup.sql` - Role assignment
11. `20260115000000_fix_cart_rls.sql` - Cart security

---

Next: [Authentication](./05-authentication.md)
