/*
  # Create User Notification Settings Table

  1. New Tables
    - `user_notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `email_notifications` (boolean, email notification preference)
      - `update_notifications` (boolean, update notification preference)
      - `marketing_notifications` (boolean, marketing notification preference)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_notifications` table
    - Add policy for authenticated users to manage their own notification settings
    - Users can only access their own notification data

  3. Indexes
    - Index on user_id for fast lookups
    - Unique constraint on user_id (one notification record per user)
*/

CREATE TABLE IF NOT EXISTS user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email_notifications boolean DEFAULT true,
  update_notifications boolean DEFAULT true,
  marketing_notifications boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);

-- RLS Policies
CREATE POLICY "Users can view own notification settings"
  ON user_notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification settings"
  ON user_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification settings"
  ON user_notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notification settings"
  ON user_notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);