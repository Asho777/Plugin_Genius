/*
# Add UPDATE Policy for User Profiles

1. Problem
  - 406 Not Acceptable error on PATCH requests to user_profiles
  - Only SELECT policy exists, missing UPDATE policy
  - PATCH operations require UPDATE permissions

2. Solution
  - Add UPDATE policy for authenticated users to update their own profiles
  - Add INSERT policy for profile creation
  - Ensure all CRUD operations are covered

3. Security
  - Users can only update their own profile data
  - Simple auth.uid() checks without subqueries
  - No recursive policy dependencies
*/

-- Add UPDATE policy for user profiles
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add INSERT policy for profile creation
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
