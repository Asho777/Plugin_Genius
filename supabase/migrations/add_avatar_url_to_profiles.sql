/*
  # Add avatar_url to user_profiles table
  
  1. Changes
    - Add `avatar_url` column to `user_profiles` table to store profile image URLs
  
  2. Security
    - Maintains existing RLS policies
*/

-- Add avatar_url column to user_profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;