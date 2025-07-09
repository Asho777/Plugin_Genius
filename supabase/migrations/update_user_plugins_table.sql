/*
# Update user plugins table schema

1. Changes
  - Add `updated_at` column to user_plugins table
  - Set default value to current timestamp
  - Add trigger to automatically update the timestamp on record changes

2. Notes
  - This ensures compatibility with existing queries that expect updated_at column
  - Maintains data integrity with automatic timestamp updates
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_plugins' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE user_plugins ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create or replace function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on record changes
DROP TRIGGER IF EXISTS update_user_plugins_updated_at ON user_plugins;
CREATE TRIGGER update_user_plugins_updated_at
  BEFORE UPDATE ON user_plugins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();