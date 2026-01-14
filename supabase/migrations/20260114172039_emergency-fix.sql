-- ============================================================================
-- EMERGENCY FIX SCRIPT FOR DATABASE SCHEMA
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/pgzexettnychgneyjmkn/sql/new
-- ============================================================================

-- Step 1: Ensure user_profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS user_profiles (
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

-- Step 2: Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Step 3: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Create or update profile for your user (umerfarooq1105@gmail.com)
-- This will create the profile if it doesn't exist, or update role to admin if it does
INSERT INTO user_profiles (id, email, full_name, role)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', 'Admin User'),
    'admin'
FROM auth.users
WHERE email = 'umerfarooq1105@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET role = 'admin', email = EXCLUDED.email;

-- Step 6: Verify the fix
SELECT 
    u.id,
    u.email,
    up.role,
    up.full_name,
    CASE WHEN up.id IS NULL THEN 'MISSING PROFILE!' ELSE 'Profile exists' END as status
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
WHERE u.email = 'umerfarooq1105@gmail.com';

-- If the above query shows 'MISSING PROFILE!', run this:
-- (This is a backup in case the user doesn't exist in auth.users yet)
-- You'll need to sign up first, then run this query
