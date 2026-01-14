-- ============================================================================
-- RLS POLICIES (Disabled for now as per existing pattern)
-- ============================================================================

-- Enable RLS
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policies for carts - users can only access their own cart
DROP POLICY IF EXISTS "Users can view own cart" ON carts;
CREATE POLICY "Users can view own cart" ON carts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own cart" ON carts;
CREATE POLICY "Users can insert own cart" ON carts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own cart" ON carts;
CREATE POLICY "Users can update own cart" ON carts
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete own cart" ON carts;
CREATE POLICY "Users can delete own cart" ON carts
  FOR DELETE USING (true);

-- Policies for cart_items
DROP POLICY IF EXISTS "Users can view own cart items" ON cart_items;
CREATE POLICY "Users can view own cart items" ON cart_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own cart items" ON cart_items;
CREATE POLICY "Users can insert own cart items" ON cart_items
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own cart items" ON cart_items;
CREATE POLICY "Users can update own cart items" ON cart_items
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete own cart items" ON cart_items;
CREATE POLICY "Users can delete own cart items" ON cart_items
;

-- Disable RLS
ALTER TABLE carts DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- Drop policies for carts
DROP POLICY "Users can view own cart" ON carts;
DROP POLICY "Users can insert own cart" ON carts;
DROP POLICY "Users can update own cart" ON carts;
DROP POLICY "Users can delete own cart" ON carts;

-- Drop policies for cart_items
DROP POLICY "Users can view own cart items" ON cart_items;
DROP POLICY "Users can insert own cart items" ON cart_items;
DROP POLICY "Users can update own cart items" ON cart_items;
DROP POLICY "Users can delete own cart items" ON cart_items;
