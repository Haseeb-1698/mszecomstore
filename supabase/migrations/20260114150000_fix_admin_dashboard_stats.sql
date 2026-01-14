-- Migration: Fix Admin Dashboard Stats Function
-- This migration updates the get_admin_dashboard_stats function to work correctly
-- after the payment_status column was removed from the orders table

-- Drop the old function
DROP FUNCTION IF EXISTS get_admin_dashboard_stats();

-- Recreate the function with correct column references and SECURITY DEFINER
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
  total_revenue DECIMAL,
  pending_orders BIGINT,
  active_customers BIGINT,
  delivered_today BIGINT
) 
SECURITY DEFINER  -- This allows the function to bypass RLS policies
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- Total revenue from all completed orders (using status instead of payment_status)
    COALESCE(SUM(CASE WHEN o.status IN ('completed', 'delivered') THEN o.amount ELSE 0 END), 0) AS total_revenue,
    -- Count of pending orders
    COUNT(*) FILTER (WHERE o.status = 'pending') AS pending_orders,
    -- Count of unique customers (users who have placed orders)
    COUNT(DISTINCT o.user_id) AS active_customers,
    -- Count of orders delivered today
    COUNT(*) FILTER (WHERE o.status = 'delivered' AND DATE(o.delivered_at) = CURRENT_DATE) AS delivered_today
  FROM orders o;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO authenticated;

-- Add a comment explaining the function
COMMENT ON FUNCTION get_admin_dashboard_stats() IS 'Returns aggregated statistics for the admin dashboard. Uses SECURITY DEFINER to bypass RLS policies.';
