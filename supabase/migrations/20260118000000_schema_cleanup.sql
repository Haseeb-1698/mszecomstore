-- Migration: Schema Cleanup
-- Date: 2026-01-18
-- Description: Remove unused columns and add missing indexes based on actual code usage analysis

-- ============================================================================
-- 1. DROP EXISTING VIEWS (to avoid dependency errors)
-- ============================================================================

DROP VIEW IF EXISTS services_with_plans;

-- ============================================================================
-- 2. CLEANUP user_profiles TABLE
-- ============================================================================
-- Remove 'phone' - Never used anywhere in the codebase (only customer_whatsapp in orders)
-- Remove 'avatar_url' - Defined but never displayed or updated

ALTER TABLE user_profiles DROP COLUMN IF EXISTS phone;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS avatar_url;

COMMENT ON TABLE user_profiles IS 'Extended user data. Role controls admin access. WhatsApp used for order contact.';

-- ============================================================================
-- 3. CLEANUP plans TABLE  
-- ============================================================================
-- Remove 'tier' - Was confused with 'type' in code. Plan names (Basic/Standard/Premium) already capture this.
-- Remove 'original_price' - Never displayed in UI
-- Remove 'savings' - Never displayed in UI (can be calculated if needed: original_price - price)

ALTER TABLE plans DROP COLUMN IF EXISTS tier;
ALTER TABLE plans DROP COLUMN IF EXISTS original_price;
ALTER TABLE plans DROP COLUMN IF EXISTS savings;

COMMENT ON TABLE plans IS 'Pricing options for services. type=shared/dedicated. is_popular highlights recommended plans.';
COMMENT ON COLUMN plans.type IS 'Access type: shared (multiple users) or dedicated (single user account)';
COMMENT ON COLUMN plans.is_popular IS 'Highlights this plan as recommended. Only one per service should be true.';

-- ============================================================================
-- 4. ADD MISSING INDEXES for display_order sorting
-- ============================================================================
-- These columns exist but weren't being used for sorting. Add indexes for efficient ORDER BY.

CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order, name);
CREATE INDEX IF NOT EXISTS idx_services_active_order ON services(is_active, display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_plans_service_order ON plans(service_id, display_order);

-- ============================================================================
-- 5. DOCUMENT existing tables/columns for clarity
-- ============================================================================

-- Services
COMMENT ON TABLE services IS 'Digital subscription products (Netflix, Spotify, etc.)';
COMMENT ON COLUMN services.badge IS 'Service-level badge: popular or best_value. Shown on service cards.';
COMMENT ON COLUMN services.display_order IS 'Sort order for service listings. Lower numbers appear first.';
COMMENT ON COLUMN services.long_description IS 'Detailed description shown on service detail page.';

-- Orders
COMMENT ON TABLE orders IS 'Customer purchase records. Status flows: pending -> processing -> completed -> delivered';
COMMENT ON COLUMN orders.delivered_at IS 'Timestamp when order was marked as delivered. Used in dashboard stats.';
COMMENT ON COLUMN orders.plan_id IS 'Primary plan for this order. Full item list in order_items table.';

-- Carts
COMMENT ON TABLE carts IS 'Shopping cart (one per user). Discount fields ready for future coupon feature.';
COMMENT ON COLUMN carts.discount IS 'Discount amount to subtract from total. UI not yet implemented.';
COMMENT ON COLUMN carts.discount_code IS 'Applied coupon/discount code. UI not yet implemented.';

-- Subscriptions
COMMENT ON TABLE subscriptions IS 'Active subscriptions with credentials. Created manually by admin after order delivery.';
COMMENT ON COLUMN subscriptions.credentials IS 'JSON object with login credentials (email, password, etc.). Displayed to customer.';

-- ============================================================================
-- 6. CREATE helper view for common service+plans query
-- ============================================================================

CREATE OR REPLACE VIEW services_with_plans AS
SELECT 
    s.id,
    s.name,
    s.slug,
    s.category,
    s.description,
    s.long_description,
    s.icon_url,
    s.badge,
    s.display_order,
    s.is_active,
    s.created_at,
    s.updated_at,
    COALESCE(
        json_agg(
            json_build_object(
                'id', p.id,
                'name', p.name,
                'type', p.type,
                'duration_months', p.duration_months,
                'price', p.price,
                'features', p.features,
                'is_popular', p.is_popular,
                'is_available', p.is_available,
                'display_order', p.display_order
            ) ORDER BY p.display_order
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'::json
    ) as plans,
    (SELECT MIN(price) FROM plans WHERE service_id = s.id AND is_available = true) as starting_price,
    (SELECT COUNT(*) FROM plans WHERE service_id = s.id AND is_available = true) as plan_count
FROM services s
LEFT JOIN plans p ON p.service_id = s.id AND p.is_available = true
GROUP BY s.id
ORDER BY s.display_order, s.name;

COMMENT ON VIEW services_with_plans IS 'Services with their plans pre-joined. Use for listings and detail pages.';

-- ============================================================================
-- 7. UPDATE get_admin_dashboard_stats to be more useful
-- ============================================================================

DROP FUNCTION IF EXISTS get_admin_dashboard_stats();

CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
    total_revenue DECIMAL,
    pending_orders INTEGER,
    processing_orders INTEGER,
    completed_orders INTEGER,
    delivered_orders INTEGER,
    cancelled_orders INTEGER,
    total_orders INTEGER,
    active_customers INTEGER,
    delivered_today INTEGER,
    revenue_today DECIMAL,
    active_subscriptions INTEGER
) AS $$
BEGIN
    RETURN QUERY 
    SELECT
        -- Revenue
        COALESCE(SUM(o.amount) FILTER (WHERE o.status != 'cancelled'), 0)::DECIMAL as total_revenue,
        
        -- Order counts by status
        COUNT(*) FILTER (WHERE o.status = 'pending')::INTEGER as pending_orders,
        COUNT(*) FILTER (WHERE o.status = 'processing')::INTEGER as processing_orders,
        COUNT(*) FILTER (WHERE o.status = 'completed')::INTEGER as completed_orders,
        COUNT(*) FILTER (WHERE o.status = 'delivered')::INTEGER as delivered_orders,
        COUNT(*) FILTER (WHERE o.status = 'cancelled')::INTEGER as cancelled_orders,
        COUNT(*)::INTEGER as total_orders,
        
        -- Customers
        COUNT(DISTINCT o.user_id)::INTEGER as active_customers,
        
        -- Today's stats
        COUNT(*) FILTER (WHERE o.delivered_at::DATE = CURRENT_DATE)::INTEGER as delivered_today,
        COALESCE(SUM(o.amount) FILTER (WHERE o.created_at::DATE = CURRENT_DATE AND o.status != 'cancelled'), 0)::DECIMAL as revenue_today,
        
        -- Subscriptions
        (SELECT COUNT(*) FROM subscriptions WHERE status = 'active')::INTEGER as active_subscriptions
    FROM orders o;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_admin_dashboard_stats IS 'Returns comprehensive dashboard statistics for admin panel.';
