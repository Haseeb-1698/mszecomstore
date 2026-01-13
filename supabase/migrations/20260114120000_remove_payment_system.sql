-- Migration: Remove Payment System
-- This migration removes all payment-related columns and enums from the database

-- ============================================================================
-- DROP DEPENDENT VIEWS FIRST
-- ============================================================================

DROP VIEW IF EXISTS order_details CASCADE;
DROP VIEW IF EXISTS service_analytics CASCADE;

-- ============================================================================
-- DROP PAYMENT COLUMNS FROM ORDERS TABLE
-- ============================================================================

-- Drop payment-related columns
ALTER TABLE orders DROP COLUMN IF EXISTS payment_status;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_reference;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_data;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_method;
ALTER TABLE orders DROP COLUMN IF EXISTS stripe_payment_id;

-- Drop payment_status index
DROP INDEX IF EXISTS idx_orders_payment_status;

-- ============================================================================
-- DROP PAYMENT METHOD ENUM
-- ============================================================================

DROP TYPE IF EXISTS payment_method CASCADE;

-- ============================================================================
-- RECREATE ORDER_DETAILS VIEW (without payment references)
-- ============================================================================

CREATE OR REPLACE VIEW order_details AS
SELECT 
    o.id,
    o.user_id,
    o.plan_id,
    o.amount,
    o.status,
    o.customer_name,
    o.customer_email,
    o.customer_whatsapp,
    o.special_instructions,
    o.created_at,
    o.updated_at,
    o.delivered_at,
    p.name AS plan_name,
    p.duration_months,
    s.name AS service_name,
    s.slug AS service_slug,
    s.icon_url AS service_icon
FROM orders o
LEFT JOIN plans p ON o.plan_id = p.id
LEFT JOIN services s ON p.service_id = s.id;

-- ============================================================================
-- RECREATE ANALYTICS VIEW (without payment_status references)
-- ============================================================================

CREATE OR REPLACE VIEW service_analytics AS
SELECT 
    s.id,
    s.name,
    s.slug,
    s.category,
    COUNT(DISTINCT o.id) AS total_orders,
    COALESCE(SUM(o.amount), 0) AS total_revenue,
    COALESCE(AVG(o.amount), 0) AS avg_order_value,
    COUNT(DISTINCT sub.id) AS active_subscriptions
FROM services s
LEFT JOIN plans p ON s.id = p.service_id
LEFT JOIN orders o ON p.id = o.plan_id
LEFT JOIN subscriptions sub ON p.id = sub.plan_id AND sub.status = 'active'
GROUP BY s.id, s.name, s.slug, s.category;
