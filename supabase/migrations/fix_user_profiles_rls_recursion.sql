/*
# Fix User Profiles RLS Infinite Recursion

1. Problem
  - The "Admins can manage all profiles" policy creates infinite recursion
  - It queries user_profiles table from within a user_profiles policy
  - This causes circular dependency and 500 errors

2. Solution
  - Remove the recursive admin policy
  - Keep only simple, non-recursive policies
  - Use auth.uid() directly without subqueries to user_profiles

3. Security
  - Users can only access their own profile data
  - Admin functionality will be handled at application level
  - No circular policy dependencies
*/

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all user roles" ON user_profiles;

-- Create simple, non-recursive RLS policies
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Simple delete policy (users can delete their own profile)
CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
</xbeshArtifact>

<xbeshAction type="supabase" operation="query" projectId="${projectId}">/*
# Fix User Profiles RLS Infinite Recursion

1. Problem
  - The "Admins can manage all profiles" policy creates infinite recursion
  - It queries user_profiles table from within a user_profiles policy
  - This causes circular dependency and 500 errors

2. Solution
  - Remove the recursive admin policy
  - Keep only simple, non-recursive policies
  - Use auth.uid() directly without subqueries to user_profiles

3. Security
  - Users can only access their own profile data
  - Admin functionality will be handled at application level
  - No circular policy dependencies
*/

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all user roles" ON user_profiles;

-- Create simple, non-recursive RLS policies
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Simple delete policy (users can delete their own profile)
CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
