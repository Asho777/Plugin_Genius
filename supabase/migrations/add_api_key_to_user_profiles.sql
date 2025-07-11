/*
# Add api_key column to user_profiles table

1. Changes
  - Add `api_key` column to user_profiles table
  - Column stores encrypted API keys for AI model access
  - Text type to accommodate various API key formats

2. Security
  - Column added to existing RLS-protected table
  - Users can only access their own API keys through existing policies

3. Notes
  - This column is required for API key persistence functionality
  - Supports the existing code that expects this column to exist
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'api_key'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN api_key text;
  END IF;
END $$;
