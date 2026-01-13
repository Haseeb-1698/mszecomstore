-- Migration: Plan Structure Improvements
-- This migration improves the plan structure to better support Basic, Standard, Premium tiers

-- ============================================================================
-- PLANS TABLE - Add tier-based pricing structure
-- ============================================================================

-- Add tier column to identify Basic, Standard, Premium (nullable first)
ALTER TABLE plans ADD COLUMN IF NOT EXISTS tier TEXT;

-- Update existing plans to set their tier based on duration
-- 1 month = basic, 3 months = standard, 12 months = premium
UPDATE plans SET tier = CASE 
  WHEN duration_months = 1 THEN 'basic'
  WHEN duration_months = 3 THEN 'standard'
  WHEN duration_months = 12 THEN 'premium'
  WHEN LOWER(name) LIKE '%basic%' THEN 'basic'
  WHEN LOWER(name) LIKE '%standard%' THEN 'standard'
  WHEN LOWER(name) LIKE '%premium%' THEN 'premium'
  ELSE 'basic'
END WHERE tier IS NULL;

-- Now add the check constraint after data is updated
ALTER TABLE plans ADD CONSTRAINT plans_tier_check CHECK (tier IN ('basic', 'standard', 'premium'));

-- Add description for plan-specific features
ALTER TABLE plans ADD COLUMN IF NOT EXISTS description TEXT;

-- Add badge for highlighting special plans
ALTER TABLE plans ADD COLUMN IF NOT EXISTS badge TEXT CHECK (badge IN ('popular', 'best_value', 'recommended'));

-- ============================================================================
-- VIEWS FOR EASIER QUERYING
-- ============================================================================

-- Drop existing view if it exists
DROP VIEW IF EXISTS services_with_plans;

-- Create view for services with their plans
CREATE VIEW services_with_plans AS
SELECT 
  s.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', p.id,
        'name', p.name,
        'tier', p.tier,
        'duration_months', p.duration_months,
        'price', p.price,
        'original_price', p.original_price,
        'savings', p.savings,
        'features', p.features,
        'is_popular', p.is_popular,
        'is_available', p.is_available,
        'badge', p.badge,
        'display_order', p.display_order,
        'description', p.description
      ) ORDER BY p.display_order, p.duration_months
    ) FILTER (WHERE p.id IS NOT NULL),
    '[]'::json
  ) as plans
FROM services s
LEFT JOIN plans p ON s.id = p.service_id
GROUP BY s.id;

-- ============================================================================
-- HELPER FUNCTION FOR CALCULATING MONTHLY RATE
-- ============================================================================

-- Function to calculate per-month price
CREATE OR REPLACE FUNCTION calculate_monthly_rate(total_price DECIMAL, duration_months INTEGER)
RETURNS DECIMAL AS $$
BEGIN
  IF duration_months > 0 THEN
    RETURN ROUND(total_price / duration_months, 2);
  ELSE
    RETURN total_price;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- UPDATE EXISTING DATA
-- ============================================================================

-- Set popular flag for Standard plans (most common choice)
UPDATE plans SET is_popular = true WHERE tier = 'standard' AND is_popular IS NULL;

-- Set badges
UPDATE plans SET badge = 'best_value' WHERE tier = 'premium' AND badge IS NULL;
UPDATE plans SET badge = 'popular' WHERE tier = 'standard' AND badge IS NULL;

-- Set display order
UPDATE plans SET display_order = 1 WHERE tier = 'basic';
UPDATE plans SET display_order = 2 WHERE tier = 'standard';
UPDATE plans SET display_order = 3 WHERE tier = 'premium';

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_plans_tier ON plans(tier);
CREATE INDEX IF NOT EXISTS idx_plans_display_order ON plans(display_order);
