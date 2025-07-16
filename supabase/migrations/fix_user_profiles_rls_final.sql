/*
# Fix User Profiles RLS Policies - Final Solution

1. Problem
  - 406 Not Acceptable error on PATCH requests to user_profiles
  - RLS policies may be causing conflicts or infinite recursion
  - Need to completely reset and rebuild policies safely

2. Solution
  - Drop all existing policies completely
  - Rebuild with simple, tested policies
  - Ensure no circular dependencies
  - Test each policy individually

3. Security
  - Users can only access their own profile data
  - Simple auth.uid() checks without subqueries
  - No recursive policy dependencies
*/

-- Disable RLS temporarily to clean up
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies completely
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all user roles" ON user_profiles;

-- Drop any functions that might cause issues
DROP FUNCTION IF EXISTS can_manage_user(uuid, uuid);
DROP FUNCTION IF EXISTS get_user_role_level(uuid);
DROP FUNCTION IF EXISTS check_user_permission(uuid, text);

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, safe policies one by one
CREATE POLICY "allow_select_own_profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "allow_update_own_profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "allow_insert_own_profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
