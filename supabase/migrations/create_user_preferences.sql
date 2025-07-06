/*
  # Create User Preferences Table

  1. New Tables
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `language` (text, preferred language)
      - `timezone` (text, preferred timezone)
      - `dark_mode` (boolean, dark mode preference)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_preferences` table
    - Add policy for authenticated users to manage their own preferences
    - Users can only access their own preference data

  3. Indexes
    - Index on user_id for fast lookups
    - Unique constraint on user_id (one preference record per user)
*/

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  language text DEFAULT 'en',
  timezone text DEFAULT 'UTC',
  dark_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- RLS Policies
CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);