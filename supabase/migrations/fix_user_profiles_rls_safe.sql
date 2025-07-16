/*
# Fix User Profiles RLS Policies - Safe Reset

1. Problem
  - 406 Not Acceptable error on PATCH requests to user_profiles
  - Policies already exist and need to be safely replaced
  - Need to handle existing policies without conflicts

2. Solution
  - Use DO blocks to safely check and drop existing policies
  - Rebuild with simple, tested policies
  - Ensure no circular dependencies

3. Security
  - Users can only access their own profile data
  - Simple auth.uid() checks without subqueries
  - No recursive policy dependencies
*/

-- Disable RLS temporarily to clean up
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Use DO block to safely drop policies if they exist
DO $$
BEGIN
  -- Drop policies if they exist
  DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
  DROP POLICY IF EXISTS "Admins can manage all user roles" ON user_profiles;
  DROP POLICY IF EXISTS "allow_select_own_profile" ON user_profiles;
  DROP POLICY IF EXISTS "allow_update_own_profile" ON user_profiles;
  DROP POLICY IF EXISTS "allow_insert_own_profile" ON user_profiles;
  
  -- Drop any functions that might cause issues
  DROP FUNCTION IF EXISTS can_manage_user(uuid, uuid);
  DROP FUNCTION IF EXISTS get_user_role_level(uuid);
  DROP FUNCTION IF EXISTS check_user_permission(uuid, text);
END $$;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, safe policies
CREATE POLICY "user_select_own_profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_update_own_profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_insert_own_profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
