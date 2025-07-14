/*
# Fix User Profiles Table Structure

1. Table Updates
  - Ensure user_profiles table has correct structure with user_id as foreign key
  - Add missing columns if they don't exist
  - Update constraints and indexes

2. Data Migration
  - Ensure existing data uses user_id correctly
  - Create missing user profiles for authenticated users

3. Security
  - Update RLS policies to use user_id correctly
  - Ensure proper access control
*/

-- Ensure user_profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  company text,
  avatar_url text,
  api_key text,
  role_id uuid REFERENCES user_roles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Check and add user_id column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Check and add email column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email text;
  END IF;

  -- Check and add full_name column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN full_name text;
  END IF;

  -- Check and add company column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'company'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN company text;
  END IF;

  -- Check and add avatar_url column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN avatar_url text;
  END IF;

  -- Check and add api_key column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'api_key'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN api_key text;
  END IF;

  -- Check and add role_id column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role_id uuid REFERENCES user_roles(id);
  END IF;

  -- Check and add created_at column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;

  -- Check and add updated_at column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add unique constraint on user_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'user_profiles' 
    AND constraint_name = 'user_profiles_user_id_key'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them correctly
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all user roles" ON user_profiles;

-- Create correct RLS policies using user_id
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

-- Admin policy for role management
CREATE POLICY "Admins can manage all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN user_roles ur ON up.role_id = ur.id
      WHERE up.user_id = auth.uid() AND ur.name = 'Admin'
    )
  );

-- Function to create user profile with default role
CREATE OR REPLACE FUNCTION create_user_profile_with_role(user_id uuid, user_email text, user_name text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  default_role_id uuid;
  profile_id uuid;
BEGIN
  -- Get default role (User)
  SELECT id INTO default_role_id
  FROM user_roles
  WHERE name = 'User'
  LIMIT 1;

  -- Insert user profile
  INSERT INTO user_profiles (
    user_id,
    email,
    full_name,
    role_id,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    user_email,
    COALESCE(user_name, split_part(user_email, '@', 1)),
    default_role_id,
    now(),
    now()
  )
  RETURNING id INTO profile_id;

  RETURN profile_id;
END;
$$;

-- Create profiles for existing users who don't have them
DO $$
DECLARE
  user_record RECORD;
  default_role_id uuid;
BEGIN
  -- Get default role ID
  SELECT id INTO default_role_id
  FROM user_roles
  WHERE name = 'User'
  LIMIT 1;

  -- Create profiles for users without them
  FOR user_record IN 
    SELECT au.id, au.email, au.raw_user_meta_data->>'full_name' as full_name
    FROM auth.users au
    LEFT JOIN user_profiles up ON au.id = up.user_id
    WHERE up.user_id IS NULL
  LOOP
    INSERT INTO user_profiles (
      user_id,
      email,
      full_name,
      role_id,
      created_at,
      updated_at
    ) VALUES (
      user_record.id,
      user_record.email,
      COALESCE(user_record.full_name, split_part(user_record.email, '@', 1)),
      default_role_id,
      now(),
      now()
    )
    ON CONFLICT (user_id) DO NOTHING;
  END LOOP;
END $$;
