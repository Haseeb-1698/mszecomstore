-- Migration: Schema Improvements
-- This migration adds missing fields and improves the schema based on application requirements

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Create payment method enum
CREATE TYPE payment_method AS ENUM ('easypaisa', 'jazzcash', 'bank_transfer');

-- Create order status enum (extends payment_status concept)
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled', 'delivered');

-- Create service category enum
CREATE TYPE service_category AS ENUM ('streaming', 'professional', 'vpn', 'gaming', 'education', 'music', 'productivity', 'other');

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================

-- Create user profiles table for storing additional user information
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for email lookup
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- ============================================================================
-- SERVICES TABLE IMPROVEMENTS
-- ============================================================================

-- Add slug column to services
ALTER TABLE services ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add updated_at column to services
ALTER TABLE services ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add long_description column for detailed service info
ALTER TABLE services ADD COLUMN IF NOT EXISTS long_description TEXT;

-- Add badge column for popular/best value
ALTER TABLE services ADD COLUMN IF NOT EXISTS badge TEXT CHECK (badge IN ('popular', 'best_value', NULL));

-- Add display_order for custom sorting
ALTER TABLE services ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Make slug unique (will populate later with a trigger)
-- First populate existing services with slugs
UPDATE services SET slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), '''', '')) WHERE slug IS NULL;

-- Create unique index on slug
CREATE UNIQUE INDEX idx_services_slug ON services(slug);

-- ============================================================================
-- PLANS TABLE IMPROVEMENTS
-- ============================================================================

-- Add features column to plans (JSONB array of feature strings)
ALTER TABLE plans ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

-- Add original_price for showing discounts
ALTER TABLE plans ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);

-- Add savings column (can be computed but useful for display)
ALTER TABLE plans ADD COLUMN IF NOT EXISTS savings DECIMAL(10,2);

-- Add is_popular flag
ALTER TABLE plans ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;

-- Add updated_at column
ALTER TABLE plans ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add display_order for custom sorting within service
ALTER TABLE plans ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- ============================================================================
-- ORDERS TABLE IMPROVEMENTS
-- ============================================================================

-- Add customer info columns (denormalized for easy access)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_whatsapp TEXT;

-- Add order status (more comprehensive than just payment status)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status order_status DEFAULT 'pending';

-- Add payment method column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method payment_method;

-- Add special instructions
ALTER TABLE orders ADD COLUMN IF NOT EXISTS special_instructions TEXT;

-- Add updated_at and delivered_at timestamps
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- ============================================================================
-- ORDER ITEMS TABLE (new)
-- ============================================================================

-- Create order_items table for multi-item orders
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  service_name TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for order_items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_plan_id ON order_items(plan_id);

-- ============================================================================
-- SUBSCRIPTIONS TABLE IMPROVEMENTS
-- ============================================================================

-- Add updated_at column
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add auto_renew flag
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT false;

-- Add notes column for admin
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS notes TEXT;

-- Link subscription to order for traceability
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL;

-- Index for order_id
CREATE INDEX idx_subscriptions_order_id ON subscriptions(order_id);

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Function to auto-generate slug from service name
CREATE OR REPLACE FUNCTION generate_service_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
    -- Handle duplicates by appending a number
    WHILE EXISTS (SELECT 1 FROM services WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
      NEW.slug := NEW.slug || '-' || floor(random() * 1000)::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate slug on insert
CREATE TRIGGER trigger_generate_service_slug
  BEFORE INSERT ON services
  FOR EACH ROW
  EXECUTE FUNCTION generate_service_slug();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER trigger_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for services with plans (useful for API)
CREATE OR REPLACE VIEW services_with_plans AS
SELECT 
  s.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', p.id,
        'name', p.name,
        'type', p.type,
        'duration_months', p.duration_months,
        'price', p.price,
        'original_price', p.original_price,
        'savings', p.savings,
        'features', p.features,
        'is_popular', p.is_popular,
        'is_available', p.is_available
      ) ORDER BY p.display_order, p.duration_months
    ) FILTER (WHERE p.id IS NOT NULL),
    '[]'::json
  ) AS plans
FROM services s
LEFT JOIN plans p ON s.id = p.service_id AND p.is_available = true
GROUP BY s.id;

-- View for order details with items
CREATE OR REPLACE VIEW order_details AS
SELECT 
  o.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', oi.id,
        'service_name', oi.service_name,
        'plan_name', oi.plan_name,
        'duration_months', oi.duration_months,
        'price', oi.price,
        'quantity', oi.quantity
      )
    ) FILTER (WHERE oi.id IS NOT NULL),
    '[]'::json
  ) AS items,
  up.full_name AS profile_name,
  up.whatsapp AS profile_whatsapp
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN user_profiles up ON o.user_id = up.id
GROUP BY o.id, up.full_name, up.whatsapp;

-- ============================================================================
-- USEFUL FUNCTIONS
-- ============================================================================

-- Function to get dashboard stats for admin
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
  total_revenue DECIMAL,
  pending_orders BIGINT,
  active_customers BIGINT,
  delivered_today BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN o.payment_status = 'completed' THEN o.amount ELSE 0 END), 0) AS total_revenue,
    COUNT(*) FILTER (WHERE o.status = 'pending') AS pending_orders,
    COUNT(DISTINCT o.user_id) AS active_customers,
    COUNT(*) FILTER (WHERE o.status = 'delivered' AND DATE(o.delivered_at) = CURRENT_DATE) AS delivered_today
  FROM orders o;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_uuid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES FOR NEW TABLES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- User profiles: users can view and update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (is_admin(auth.uid()));

-- Order items: users can view their own order items
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Order items: users can insert items for their own orders  
CREATE POLICY "Users can insert own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- ============================================================================
-- DISABLE RLS FOR DEVELOPMENT (matching existing pattern)
-- ============================================================================

-- Keep RLS disabled for development as per existing migration
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
