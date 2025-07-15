/*
# Create Missing User Tables for Settings Service

1. New Tables
  - `user_security` - User security settings and password history
  - `user_notifications` - User notification preferences
  - `user_preferences` - User application preferences (language, timezone, theme)

2. Data Population
  - Create default records for existing users
  - Set sensible defaults for all settings

3. Security
  - Enable RLS on all new tables
  - Add policies for users to manage their own settings only
*/

-- Create user_security table
CREATE TABLE IF NOT EXISTS user_security (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  password_last_changed timestamptz DEFAULT now(),
  two_factor_enabled boolean DEFAULT false,
  backup_codes_generated boolean DEFAULT false,
  login_attempts integer DEFAULT 0,
  locked_until timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_notifications table
CREATE TABLE IF NOT EXISTS user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  update_notifications boolean DEFAULT true,
  marketing_notifications boolean DEFAULT false,
  security_notifications boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  language text DEFAULT 'en',
  timezone text DEFAULT 'utc',
  dark_mode boolean DEFAULT false,
  items_per_page integer DEFAULT 10,
  auto_save boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE user_security ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_security
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_security' AND policyname = 'Users can view own security settings'
  ) THEN
    CREATE POLICY "Users can view own security settings"
      ON user_security
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_security' AND policyname = 'Users can update own security settings'
  ) THEN
    CREATE POLICY "Users can update own security settings"
      ON user_security
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_security' AND policyname = 'Users can insert own security settings'
  ) THEN
    CREATE POLICY "Users can insert own security settings"
      ON user_security
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- RLS Policies for user_notifications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_notifications' AND policyname = 'Users can view own notification settings'
  ) THEN
    CREATE POLICY "Users can view own notification settings"
      ON user_notifications
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_notifications' AND policyname = 'Users can update own notification settings'
  ) THEN
    CREATE POLICY "Users can update own notification settings"
      ON user_notifications
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_notifications' AND policyname = 'Users can insert own notification settings'
  ) THEN
    CREATE POLICY "Users can insert own notification settings"
      ON user_notifications
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- RLS Policies for user_preferences
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_preferences' AND policyname = 'Users can view own preferences'
  ) THEN
    CREATE POLICY "Users can view own preferences"
      ON user_preferences
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_preferences' AND policyname = 'Users can update own preferences'
  ) THEN
    CREATE POLICY "Users can update own preferences"
      ON user_preferences
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_preferences' AND policyname = 'Users can insert own preferences'
  ) THEN
    CREATE POLICY "Users can insert own preferences"
      ON user_preferences
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Function to create default user settings
CREATE OR REPLACE FUNCTION create_user_settings(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert default security settings
  INSERT INTO user_security (user_id)
  VALUES (user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Insert default notification settings
  INSERT INTO user_notifications (user_id)
  VALUES (user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Insert default preferences
  INSERT INTO user_preferences (user_id)
  VALUES (user_id)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Create settings for existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT id FROM auth.users
  LOOP
    PERFORM create_user_settings(user_record.id);
  END LOOP;
END $$;
