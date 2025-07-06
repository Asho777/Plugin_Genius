/*
  # Create User Security Settings Table

  1. New Tables
    - `user_security`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `password_last_changed` (timestamptz, when password was last changed)
      - `two_factor_enabled` (boolean, 2FA status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_security` table
    - Add policy for authenticated users to manage their own security settings
    - Users can only access their own security data

  3. Indexes
    - Index on user_id for fast lookups
    - Unique constraint on user_id (one security record per user)
*/

CREATE TABLE IF NOT EXISTS user_security (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  password_last_changed timestamptz DEFAULT now(),
  two_factor_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_security ENABLE ROW LEVEL SECURITY;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_security_user_id ON user_security(user_id);

-- RLS Policies
CREATE POLICY "Users can view own security settings"
  ON user_security
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own security settings"
  ON user_security
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own security settings"
  ON user_security
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own security settings"
  ON user_security
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);