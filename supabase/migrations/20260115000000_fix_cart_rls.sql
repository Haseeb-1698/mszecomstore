-- Migration: Ensure RLS is disabled on cart tables
-- This migration ensures cart tables have RLS disabled for proper access

-- Disable RLS on carts table
ALTER TABLE IF EXISTS carts DISABLE ROW LEVEL SECURITY;

-- Disable RLS on cart_items table  
ALTER TABLE IF EXISTS cart_items DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies on carts
DROP POLICY IF EXISTS "Users can view own cart" ON carts;
DROP POLICY IF EXISTS "Users can insert own cart" ON carts;
DROP POLICY IF EXISTS "Users can update own cart" ON carts;
DROP POLICY IF EXISTS "Users can delete own cart" ON carts;

-- Drop any existing policies on cart_items
DROP POLICY IF EXISTS "Users can view own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete own cart items" ON cart_items;
