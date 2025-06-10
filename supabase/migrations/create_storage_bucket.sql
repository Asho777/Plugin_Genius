/*
  # Create storage bucket for user content
  
  1. New Features
    - Create a storage bucket for user avatars and other content
  
  2. Security
    - Set up RLS policies for the bucket
*/

-- Create a storage bucket for user content if it doesn't exist
DO $$ 
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('user-content', 'user-content', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create a policy to allow authenticated users to upload files
DO $$ 
BEGIN
  INSERT INTO storage.policies (name, definition, bucket_id)
  VALUES (
    'Avatar Upload Policy',
    '(bucket_id = ''user-content'' AND auth.role() = ''authenticated'')',
    'user-content'
  )
  ON CONFLICT (name, bucket_id) DO NOTHING;
END $$;