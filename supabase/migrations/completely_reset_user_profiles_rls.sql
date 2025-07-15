/*
# Completely Reset User Profiles RLS

1. Problem
  - Infinite recursion still persists despite removing admin policies
  - There may be hidden policies, functions, or triggers causing recursion
  - Need to completely disable and rebuild RLS from scratch

2. Solution
  - Temporarily disable RLS completely
  - Drop ALL policies and related functions
  - Rebuild with minimal, safe policies
  - Test step by step

3. Security
  - Temporarily disable RLS to identify root cause
  - Rebuild with only essential policies
  - No recursive queries or subqueries
*/

-- STEP 1: Completely disable RLS
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop ALL existing policies (even if they don't exist)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all user roles" ON user_profiles;

-- STEP 3: Drop any functions that might be causing recursion
DROP FUNCTION IF EXISTS check_user_permission(uuid, text);
DROP FUNCTION IF EXISTS get_user_role_level(uuid);
DROP FUNCTION IF EXISTS can_manage_user(uuid, uuid);

-- STEP 4: Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create ONE simple policy at a time
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- STEP 6: Test if this single policy works before adding more
-- If this works, we can add the other policies one by one
